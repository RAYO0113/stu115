# 定時推送：把 releases/schedule.json 中已到時間、尚未推送的版本解密並放到班級網址。
# 加密檔以 openssl aes-256-cbc（pbkdf2）加密，金鑰在 repo Secrets 的 RELEASE_KEY。
import datetime, hashlib, json, os, subprocess, sys

SCHED = 'releases/schedule.json'
with open(SCHED, encoding='utf-8') as f:
    sched = json.load(f)
now = datetime.datetime.now(datetime.timezone.utc)
key = os.environ.get('RELEASE_KEY', '')
done = []
for r in sched['releases']:
    if r.get('done'):
        continue
    at = datetime.datetime.fromisoformat(r['at'])
    if at > now:
        print('未到時間：', r['id'], r['at'])
        continue
    if not key:
        sys.exit('::error::缺少 RELEASE_KEY（repo Settings → Secrets and variables → Actions）')
    for f in r['files']:
        tmp = f['dest'] + '.tmp'
        os.makedirs(os.path.dirname(f['dest']) or '.', exist_ok=True)
        subprocess.run(['openssl', 'enc', '-d', '-aes-256-cbc', '-pbkdf2', '-iter', '200000',
                        '-in', f['enc'], '-out', tmp, '-pass', 'env:RELEASE_KEY'], check=True)
        with open(tmp, 'rb') as fh:
            h = hashlib.sha256(fh.read()).hexdigest()
        if h != f['sha256']:
            os.remove(tmp)
            sys.exit('::error::解密後內容與預期不符：' + f['dest'])
        os.replace(tmp, f['dest'])
        os.remove(f['enc'])
        print('已推送', f['dest'])
    r['done'] = now.isoformat(timespec='seconds')
    done.append(r['id'])
if done:
    with open(SCHED, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(sched, f, ensure_ascii=False, indent=2)
        f.write('\n')
    with open(os.environ.get('GITHUB_OUTPUT', os.devnull), 'a', encoding='utf-8') as f:
        f.write('done=' + ' '.join(done) + '\n')
