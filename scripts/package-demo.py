"""Create phone-friendly deployment ZIPs from the existing project/build."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
import re

root = Path(__file__).resolve().parents[1]
output = root.parent
excluded = {'node_modules', 'dist', '.git', '.vercel', '.openai', 'test-results', 'playwright-report', '__pycache__'}
with ZipFile(output / 'shanti-sagar-source.zip', 'w', ZIP_DEFLATED) as archive:
    for file in sorted(root.rglob('*')):
        relative = file.relative_to(root)
        if file.is_file() and not any(part in excluded for part in relative.parts) and not any(part.startswith('.env') for part in relative.parts):
            archive.write(file, relative.as_posix())

dist = root / 'dist'
assert (dist / 'index.html').is_file(), 'Run npm run build first'
for asset in re.findall(r'(?:src|href)="(/[^\"]+)"', (dist / 'index.html').read_text()):
    assert (dist / asset.lstrip('/')).is_file(), f'Missing production asset: {asset}'
with ZipFile(output / 'shanti-sagar-deploy.zip', 'w', ZIP_DEFLATED) as archive:
    for file in sorted(dist.rglob('*')):
        if file.is_file():
            archive.write(file, file.relative_to(dist).as_posix())
    # Static output must NOT inherit the source project's Vite build command.
    source_config = json.loads((root / 'vercel.json').read_text())
    archive.writestr('vercel.json', json.dumps({'headers': source_config['headers']}, indent=2))
for name in ['shanti-sagar-source.zip', 'shanti-sagar-deploy.zip']:
    with ZipFile(output / name) as archive:
        assert archive.testzip() is None
        assert 'index.html' in archive.namelist()
    print(name, (output / name).stat().st_size, 'bytes; archive integrity verified')
