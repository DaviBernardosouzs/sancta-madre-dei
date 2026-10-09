# Aplicativo Android e publicação na Play Store

O site vira um aplicativo Android com o [Capacitor](https://capacitorjs.com). O app leva todo o conteúdo dentro do pacote: textos, obras, fontes e mapa. Ele abre e funciona **sem internet**, não pede permissões e não coleta dados. Links externos, como a origem de uma obra no museu, abrem no navegador do aparelho.

## Como funciona

| Peça | Onde |
|---|---|
| Modo app do build (`--app`) | `site/scripts/build.mjs`: saída em `dist-app/`, links de página apontando para `index.html` (o servidor local do Capacitor não resolve pastas) e imagens até 1280 px (o pacote cai de 117 MB para cerca de 59 MB) |
| Configuração do app | `capacitor.config.json` (id `io.github.davibernardosouzs.sanctamaterdei`) |
| Projeto Android nativo | `android/` (ícones, splash, tema, assinatura por variáveis de ambiente) |
| Build automático | `.github/workflows/android.yml` |
| Material da loja | `store/` (ícone 512, imagem de destaque, capturas) |
| Política de privacidade | página `/privacidade/` do site, ligada no rodapé |

O site da Cloudflare continua igual: `npm run build` gera `dist/` como antes.

**Atenção:** o id do app (`io.github.davibernardosouzs.sanctamaterdei`) não pode mudar depois da primeira publicação. Se quiser outro, troque em `capacitor.config.json`, `android/app/build.gradle` e `android/app/src/main/res/values/strings.xml` antes de enviar.

## Gerar o app

### Pelo GitHub (recomendado, não precisa de Android Studio)
1. Em **Actions > App Android > Run workflow**, informe a versão (ex.: `1.0.0`).
2. Ao terminar, baixe em **Artifacts**:
   - `sancta-mater-dei-teste-apk`: APK para instalar direto no celular e testar.
   - `sancta-mater-dei-play-aab`: o arquivo `.aab` para a Play Store (só aparece depois de configurar a chave, abaixo).

O workflow também roda em pull requests que mexem no app e em tags `app-v*` (ex.: `git tag app-v1.0.0 && git push origin app-v1.0.0`). O `versionCode` usa o número da execução, então cada envio à Play é sempre maior que o anterior.

### No computador
Requer Node 20+, JDK 21 e Android Studio.
```bash
npm ci
npm run build:app     # gera dist-app/ e copia para android/
npm run android:open  # abre no Android Studio para rodar no emulador ou celular
```

## Chave de upload (uma vez só)

A Play exige que o `.aab` seja assinado. Gere a chave **no seu computador** e guarde o arquivo e as senhas em lugar seguro: sem ela você não consegue publicar atualizações (dá para pedir redefinição à Google, mas demora).

```bash
keytool -genkeypair -v -keystore sancta-upload.jks -alias sancta-upload \
  -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 sancta-upload.jks > sancta-upload.b64   # no macOS: base64 -i sancta-upload.jks -o sancta-upload.b64
```

No GitHub, em **Settings > Secrets and variables > Actions**, crie:

| Segredo | Valor |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | conteúdo de `sancta-upload.b64` |
| `ANDROID_KEYSTORE_PASSWORD` | senha da keystore |
| `ANDROID_KEY_ALIAS` | `sancta-upload` |
| `ANDROID_KEY_PASSWORD` | senha da chave |

Nunca faça commit do `.jks` nem do `.b64`.

## Publicar na Play Console

1. **Conta de desenvolvedor** em play.google.com/console (taxa única de US$ 25, verificação de identidade).
2. **Criar app**: nome "Sancta Mater Dei", idioma português (Brasil), tipo **App**, **Gratuito**.
3. **Teste fechado primeiro.** Contas pessoais novas precisam de um teste fechado com pelo menos 12 testadores ativos por 14 dias seguidos antes de liberar a produção. Confira a regra atual no próprio Play Console. Envie o `.aab` na faixa de teste fechado e convide os testadores pelo e-mail.
4. **Assinatura de apps pelo Google Play**: aceite. A Google guarda a chave final e você usa a chave de upload acima.
5. **Conteúdo do app** (menu "Política"):
   - Política de privacidade: `https://SEU-DOMINIO/privacidade/` (o site precisa estar no ar).
   - Anúncios: **não contém anúncios**.
   - Acesso ao app: **todo o conteúdo está disponível sem restrições**.
   - Segurança dos dados: **não coleta nem compartilha dados**. O app não faz requisições de rede.
   - Classificação de conteúdo: responda o questionário IARC (categoria referência/educação, sem violência, sem interação entre usuários). Deve sair Livre.
   - Público-alvo: 13 anos ou mais é o caminho mais simples. Incluir crianças ativa as regras da política Famílias.
   - App de notícias: não. Apps governamentais: não.
6. **Ficha da loja** com os textos abaixo e os arquivos de `store/`.
7. Depois dos 14 dias de teste, peça acesso à produção e publique.

## Ficha da loja

**Nome (até 30):** Sancta Mater Dei

**Descrição curta (até 80):**
A vida de Maria em arte sacra, com fontes. Gratuito, sem anúncios e offline.

**Descrição completa:**
```
Sancta Mater Dei, Santa Mãe de Deus, é um livro digital independente sobre Maria, ilustrado com obras-primas da pintura sacra.

O QUE VOCÊ ENCONTRA
• A vida de Maria em leitura guiada, segundo a Escritura
• O que a fé católica ensina sobre ela, com o Catecismo e os dogmas
• Dossiê documental com 32 capítulos e 512 afirmações numeradas
• Aparições, como Lourdes e Fátima, com o que a Igreja decidiu sobre cada uma
• Devoções, títulos marianos e santuários pelo mundo
• Orações conferidas na fonte e um guia para rezar o Rosário
• Galeria de obras de Bellini, Memling, Dürer, Gerard David e outros mestres
• Cronologia, calendário e busca

FEITO COM CUIDADO
Cada afirmação relevante aponta para a sua fonte, e cada decisão da Igreja indica a autoridade que a tomou. O texto separa Escritura, doutrina, tradição e relato devocional.

PARA LER COM CALMA
Tipografia pensada para baixa visão, ajuste do tamanho da letra, modo de leitura sem distrações e opção de ler sem animações. Todo o conteúdo funciona sem internet.

GRATUITO E SEM RASTREAMENTO
Sem anúncios, sem cadastro e sem coleta de dados.

Este é um projeto independente e não é um órgão oficial da Igreja Católica. O conteúdo passou por pesquisa documental, mas não por revisão teológica humana.
```

**Categoria:** Livros e referências. **Tags:** religião, catolicismo, arte.

**Arquivos:**
| Item da Play | Arquivo |
|---|---|
| Ícone do app 512×512 | `store/icone-512.png` |
| Imagem de destaque 1024×500 | `store/feature-graphic-1024x500.png` |
| Capturas de tela do celular (2 a 8) | `store/capturas/*.png` (1080×1920) |

As obras usadas são de domínio público (Met Open Access, CC0) e os créditos completos estão na Biblioteca do app.

## Atualizar o app

Mudou o conteúdo? Rode o workflow de novo (ou crie uma tag `app-v1.0.1`) e envie o novo `.aab` na Play Console. O site da Cloudflare segue o fluxo normal.

## Ícones e abertura (8 de outubro de 2026)
Todos gerados com ImageMagick a partir de `site/src/assets/img/favicons/favicon-512x512.png` (a mesma arte dos favicons do site), com fundo marfim `#F8F1E1`:
- Ícone adaptativo (`mipmap-*/ic_launcher_foreground.png`, 108 dp): a arte ocupa 54% do quadro, para caber no círculo seguro de 66 dp em qualquer máscara do sistema (calculado pelo raio máximo dos pixels da arte); fundo em `values/ic_launcher_background.xml`.
- Ícones antigos (`ic_launcher.png`, quadrado arredondado, arte a 78%) e redondos (`ic_launcher_round.png`, arte a 72%), de 48 a 192 px.
- Abertura: `splash_background` em `values/colors.xml` passou de azul-noite para marfim, porque o manto azul da arte desaparecia sobre o fundo escuro; as `splash.png` (retrato e paisagem) têm a arte centralizada a 36% da menor dimensão.
- `store/icone-512.png`: quadrado cheio, sem transparência, arte a 74% (a Play Store arredonda os cantos).
- Não compilado nesta máquina (sem Android SDK): conferir num build `npm run build:app` e no Android Studio antes de publicar.
