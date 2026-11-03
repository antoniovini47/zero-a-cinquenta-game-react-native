import sys
from PIL import Image, ImageDraw, ImageFont
S, F = sys.argv[1], sys.argv[2]
font = lambda w, s: ImageFont.truetype(f"{F}/{w}/Nunito_{w}.ttf", s)
NIGHT, YELLOW, INK, MUTED = "#0F0D1A", "#FFD23F", "#F7F3FF", "#A9A2C4"
SHOTS = [
    ("start", "Abriu, já está jogando", "O número já vem sorteado"),
    ("mid", "A faixa vai fechando", "Toque, passe o celular e torça"),
    ("lost", "Quem achar, perde!", "E paga a prenda da roda"),
    ("hide", "Ou esconda você mesmo", "Modo Escolher número"),
    ("rules", "Regras em 10 segundos", "Para a roda toda entender"),
]
for i, (name, title, sub) in enumerate(SHOTS, 1):
    c = Image.new("RGB", (1080, 1920), NIGHT); d = ImageDraw.Draw(c)
    d.text((540, 150), title, font=font("900Black", 78), fill=YELLOW, anchor="mm")
    d.text((540, 245), sub, font=font("700Bold", 44), fill=INK, anchor="mm")
    shot = Image.open(f"{S}/raw/{name}.png").convert("RGB").crop((0, 60, 1080, 2400))
    w = 860; shot = shot.resize((w, round(shot.height * w / 1080)), Image.LANCZOS)
    mask = Image.new("L", shot.size, 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, *shot.size), 48, fill=255)
    c.paste(shot, ((1080 - w) // 2, 340), mask)
    c.save(f"{S}/out/shot{i}.png")
fg = Image.new("RGB", (1024, 500), NIGHT); d = ImageDraw.Draw(fg)
for k in range(10):
    x, y = 640 + (k % 5) * 72, 120 + (k // 5) * 72 + 70
    d.rounded_rectangle((x, y, x + 62, y + 62), 14, fill=YELLOW if k not in (0, 1, 2) else "#221E36")
    d.text((x + 31, y + 31), str(k + 23), font=font("900Black", 28), fill="#1A1426" if k not in (0, 1, 2) else "#4A4466", anchor="mm")
d.text((60, 190), "Zero a Cinquenta", font=font("900Black", 60), fill=INK, anchor="lm")
d.text((60, 270), "Quem achar o número, perde!", font=font("800ExtraBold", 36), fill=YELLOW, anchor="lm")
d.text((60, 330), "O jogo da roda de amigos", font=font("700Bold", 30), fill=MUTED, anchor="lm")
fg.save(f"{S}/out/feature.png")
