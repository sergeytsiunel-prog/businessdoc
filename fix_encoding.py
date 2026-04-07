import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Заменяем проблемные символы на безопасные
replacements = {
    '—': '-', '–': '-', '―': '-',
    '"': '"', '"': '"', '"': '"', '"': '"',
    '…': '...',
    '→': '->',
    '₽': 'руб.',
    '«': '"', '»': '"',
    ''': "'", ''': "'", ''': "'", ''': "'",
    ' ': ' ', ' ': ' ', ' ': ' ',
    '‐': '-', '‑': '-', '‑': '-', '‑': '-', '‑': '-',
    '⁄': '/',
    '‹': '<', '›': '>',
    '‍': '', '‌': '', '‌': '',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Готово! Спецсимволы заменены.")
