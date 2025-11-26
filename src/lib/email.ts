import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('❌ Erro Resend:', error);
      return { success: false, error };
    }

    console.log('✅ E-mail enviado via Resend:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    return { success: false, error };
  }
}

// Template HTML com Design "Dark Premium" + Sistema de Referral
export function getConfirmationEmailHTML(userName?: string, referralLink?: string) {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Confirmação de Inscrição - Incode</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media screen and (max-width: 600px) {
      .content-table { width: 100% !important; padding: 20px !important; }
      .mobile-padding { padding: 0 20px !important; }
      .hero-text { font-size: 32px !important; line-height: 40px !important; }
      .referral-code { font-size: 11px !important; }
    }
    /* Hover effects for capable clients */
    .button-primary:hover {
      background: #7c3aed !important;
      box-shadow: 0 0 20px rgba(124, 58, 237, 0.5) !important;
    }
    .button-referral:hover {
      background: #2dd4bf !important;
      border-color: #2dd4bf !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; word-spacing: normal; background-color: #09090B; color: #E4E4E7; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <!-- Container Fundo Escuro -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #09090B;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <!-- Cartão Principal -->
        <table class="content-table" width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #121214; border: 1px solid #27272A; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); overflow: hidden; max-width: 600px;">
          
          <!-- Header Minimalista com Logo em Texto -->
          <tr>
            <td style="padding: 40px 40px 0 40px; text-align: left;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding-right: 12px;">
                    <!-- Ícone Geométrico -->
                    <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #a78bfa, #2dd4bf); border-radius: 6px;"></div>
                  </td>
                  <td>
                    <span style="font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; font-family: 'Courier New', monospace;">INCODE_</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td class="mobile-padding" style="padding: 30px 40px;">
              ${userName ? `
              <p style="margin: 0 0 20px 0; font-family: 'Courier New', monospace; color: #a78bfa; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                &gt; SYSTEM.LOG: USER_DETECTED ("${userName}")
              </p>
              ` : ''}
              
              <h1 class="hero-text" style="margin: 0 0 24px 0; color: #ffffff; font-size: 42px; line-height: 48px; font-weight: 800; letter-spacing: -1.5px;">
                O futuro do seu negócio <span style="color: transparent; background-clip: text; -webkit-background-clip: text; background-image: linear-gradient(90deg, #a78bfa, #2dd4bf);">começa agora.</span>
              </h1>
              
              <p style="margin: 0 0 32px 0; color: #A1A1AA; font-size: 17px; line-height: 1.6;">
                Recebemos sua resposta. Você acaba de dar o primeiro passo para desbloquear o verdadeiro potencial da automação inteligente. Não é apenas software; é tempo recuperado.
              </p>

              <!-- Box 'Status' -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #18181B; border: 1px solid #27272A; border-radius: 12px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 8px; height: 8px; background-color: #2dd4bf; border-radius: 50%; box-shadow: 0 0 10px #2dd4bf; margin-top: 6px;"></div>
                        </td>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #ffffff; font-weight: 600; font-size: 15px;">Inscrição Confirmada</p>
                          <p style="margin: 0; color: #71717A; font-size: 13px;">Seus dados foram processados com sucesso.</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 16px 0;">
                          <div style="height: 1px; background-color: #27272A;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td width="40" valign="top">
                          <div style="width: 8px; height: 8px; background-color: #a78bfa; border-radius: 50%; margin-top: 6px;"></div>
                        </td>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #ffffff; font-weight: 600; font-size: 15px;">Beta: Dezembro 2025</p>
                          <p style="margin: 0; color: #71717A; font-size: 13px;">Você receberá o token de acesso prioritário.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          ${referralLink ? `
          <!-- Referral System Section -->
          <tr>
            <td class="mobile-padding" style="padding: 0 40px 40px 40px;">
              <!-- Terminal-style Referral Box -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #000000; border: 1px solid #2dd4bf; border-radius: 12px; box-shadow: 0 0 20px rgba(45, 212, 191, 0.15);">
                <tr>
                  <td style="padding: 24px;">
                    <!-- Header do Terminal -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 16px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 13px; color: #2dd4bf; letter-spacing: 0.5px;">
                            &gt; SYSTEM.GENERATE: REFERRAL_TOKEN
                          </p>
                        </td>
                      </tr>
                    </table>

                    <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.5px;">
                      Seu Link de Acesso Exclusivo
                    </h3>
                    
                    <p style="margin: 0 0 20px 0; color: #71717A; font-size: 14px; line-height: 1.6;">
                      Compartilhe com outros empreendedores e ajude a construir o futuro da automação no Brasil. Cada resposta nos aproxima do lançamento.
                    </p>

                    <!-- Code Block com Link -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #18181B; border: 1px dashed #27272A; border-radius: 8px; margin-bottom: 20px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="margin: 0 0 8px 0; font-family: 'Courier New', monospace; font-size: 10px; color: #52525B; text-transform: uppercase; letter-spacing: 1px;">
                            // YOUR_UNIQUE_URL
                          </p>
                          <code class="referral-code" style="display: block; color: #2dd4bf; font-size: 13px; word-break: break-all; font-family: 'Courier New', monospace; line-height: 1.5;">
                            ${referralLink}
                          </code>
                        </td>
                      </tr>
                    </table>

                    <!-- Botão Copy Link -->
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background-color: transparent; border: 2px solid #2dd4bf; border-radius: 10px; overflow: hidden;">
                          <a href="${referralLink}" class="button-referral" style="display: block; padding: 14px 32px; color: #2dd4bf; text-decoration: none; font-weight: 700; font-size: 15px; font-family: 'Courier New', monospace; transition: all 0.3s ease;">
                            &gt; COPY_LINK()
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Stats Preview -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #27272A;">
                      <tr>
                        <td style="text-align: center; padding-right: 12px;">
                          <p style="margin: 0 0 4px 0; color: #2dd4bf; font-size: 24px; font-weight: 700;">0</p>
                          <p style="margin: 0; color: #52525B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Referrals</p>
                        </td>
                        <td style="text-align: center; padding-left: 12px; border-left: 1px solid #27272A;">
                          <p style="margin: 0 0 4px 0; color: #a78bfa; font-size: 24px; font-weight: 700;">∞</p>
                          <p style="margin: 0; color: #52525B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Potential</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- CTA Section -->
          <tr>
            <td align="left" style="padding: 0 40px 50px 40px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: #ffffff; border-radius: 12px; overflow: hidden;">
                    <a href="${referralLink || 'https://useincode.app'}" class="button-primary" style="display: block; padding: 16px 36px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: 700; font-size: 16px; border: 1px solid #ffffff; transition: all 0.3s ease;">
                      ${referralLink ? 'Compartilhar Pesquisa' : 'Acessar Portal Incode'} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Estilo 'Terminal' -->
          <tr>
            <td style="background-color: #000000; border-top: 1px solid #27272A; padding: 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 12px; color: #52525B;">
                      // CONNECT WITH US<br>
                      <a href="mailto:hello@useincode.app" style="color: #71717A; text-decoration: none; border-bottom: 1px dotted #71717A;">hello@useincode.app</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #3F3F46; line-height: 1.5;">
                      &copy; ${currentYear} Incode Automation. São Paulo, Brasil.<br>
                      <span style="opacity: 0.5;">Seus dados estão protegidos pela LGPD</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Efeito de sombra inferior suave -->
        <table width="400" align="center" cellpadding="0" cellspacing="0" role="presentation">
           <tr>
             <td style="padding-top: 20px;">
               <div style="height: 1px; background: radial-gradient(circle, #27272A 0%, rgba(9,9,11,0) 100%);"></div>
             </td>
           </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
