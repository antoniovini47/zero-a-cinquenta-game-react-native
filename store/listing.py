import sys, requests, warnings
warnings.filterwarnings("ignore")
from google.oauth2 import service_account
from google.auth.transport.requests import Request

key, pkg, out = sys.argv[1:4]
PREMIUM = pkg.endswith("premium")
LANG = "pt-BR"
TITLE = "Zero a Cinquenta Premium" if PREMIUM else "Zero a Cinquenta"
SHORT = "O jogo da roda de amigos: quem achar o número secreto perde!" + (" Sem anúncios." if PREMIUM else "")
FULL = """O famoso jogo de roda de amigos no seu celular. Abriu, já está jogando: o número secreto já vem sorteado.

COMO JOGAR
Cada um toca num número de 1 a 50 e passa o celular. A faixa vai fechando ("entre 18 e 37") até alguém tocar no número secreto. Quem achar, perde e paga a prenda.

DOIS MODOS
• Sortear: o app esconde o número e todo mundo joga, inclusive quem está com o celular.
• Escolher número: um jogador esconde o número e passa o celular. Se sobrar só o número secreto, quem escondeu perde.

POR QUE VOCÊ VAI GOSTAR
• Começa na hora, sem cadastro e sem configuração.
• Números grandes, fáceis de tocar no meio da roda.
• Som e vibração a cada palpite, e a revelação do número no final.
• Funciona sem internet.
""" + ("\nVersão Premium: sem nenhum anúncio." if PREMIUM else "\nO app é gratuito e mostra anúncios. Prefere sem? Existe a versão Premium.") + """

Curiosidade: apesar do nome, o jogo vai de 1 a 50.

Desenvolvedor: https://cchybdz3.app-adstxt.dev"""

c = service_account.Credentials.from_service_account_file(key, scopes=["https://www.googleapis.com/auth/androidpublisher"])
c.refresh(Request())
H = {"Authorization": f"Bearer {c.token}"}
B = f"https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{pkg}"
U = f"https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/{pkg}"
eid = requests.post(f"{B}/edits", headers=H, timeout=60).json()["id"]


def check(r, step):
    if not r.ok:
        print(step, r.status_code, r.text[:600]); requests.delete(f"{B}/edits/{eid}", headers=H, timeout=60); sys.exit(1)
    return r.json() if r.text else {}


check(requests.put(f"{B}/edits/{eid}/listings/{LANG}", headers=H, json={"language": LANG, "title": TITLE, "shortDescription": SHORT, "fullDescription": FULL}, timeout=60), "LISTING")
for kind, files in [("featureGraphic", ["feature.png"]), ("phoneScreenshots", [f"shot{i}.png" for i in range(1, 6)])]:
    check(requests.delete(f"{B}/edits/{eid}/listings/{LANG}/{kind}", headers=H, timeout=60), f"DELETE {kind}")
    for name in files:
        with open(f"{out}/{name}", "rb") as f:
            check(requests.post(f"{U}/edits/{eid}/listings/{LANG}/{kind}?uploadType=media", headers={**H, "Content-Type": "image/png"}, data=f, timeout=120), f"IMAGE {name}")
check(requests.post(f"{B}/edits/{eid}:commit", headers=H, timeout=120), "COMMIT")
print("LISTING COMMITTED", pkg)
