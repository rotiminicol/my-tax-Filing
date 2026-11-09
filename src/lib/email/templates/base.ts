/**
 * Central Branded Email Layout Generator for TaxFilling
 * Consistent with website design: Green (#18623f), Yellow (#ffe95c), Mint (#d5f5c2), White (#ffffff)
 */

export interface BaseEmailOptions {
  title: string;
  preheader?: string;
  badge?: string;
  badgeColor?: "mint" | "yellow" | "coral";
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  isMarketing?: boolean;
  unsubscribeUrl?: string;
  preferencesUrl?: string;
}

export function renderBaseEmailLayout(opts: BaseEmailOptions): string {
  const {
    title,
    preheader = "TaxFilling — Official Tax & Compliance Notice",
    badge,
    badgeColor = "mint",
    contentHtml,
    ctaText,
    ctaUrl,
    ctaSecondaryText,
    ctaSecondaryUrl,
    isMarketing = false,
    unsubscribeUrl = "https://taxfiling.com.ng/unsubscribe",
    preferencesUrl = "https://taxfiling.com.ng/customer-dashboard/settings",
  } = opts;

  const currentYear = new Date().getFullYear();

  const badgeBg =
    badgeColor === "yellow" ? "#ffe95c" : badgeColor === "coral" ? "#fee2e2" : "#d5f5c2";
  const badgeText =
    badgeColor === "yellow" ? "#18623f" : badgeColor === "coral" ? "#991b1b" : "#18623f";

  const ctaButton =
    ctaText && ctaUrl
      ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 28px 0 16px 0;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #ffe95c;">
          <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; color: #18623f; text-decoration: none; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #f6de48;">
            ${ctaText} &rarr;
          </a>
        </td>
      </tr>
    </table>`
      : "";

  const secondaryCta =
    ctaSecondaryText && ctaSecondaryUrl
      ? `
    <p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      Or <a href="${ctaSecondaryUrl}" style="color: #18623f; font-weight: 600; text-decoration: underline;">${ctaSecondaryText}</a>
    </p>`
      : "";

  const badgeSection = badge
    ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 16px;">
      <tr>
        <td style="background-color: ${badgeBg}; color: ${badgeText}; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${badge}
        </td>
      </tr>
    </table>`
    : "";

  const marketingFooter = isMarketing
    ? `
    <tr style="border-top: 1px solid rgba(255,255,255,0.12);">
      <td style="padding: 16px 0 0 0; font-size: 12px; color: rgba(252,250,245,0.7); line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center;">
        You received this promotional message because you opted into marketing communications from TaxFilling.<br />
        <a href="${unsubscribeUrl}" style="color: #ffe95c; text-decoration: underline; margin-right: 12px;">Unsubscribe from offers</a>
        <a href="${preferencesUrl}" style="color: #ffe95c; text-decoration: underline;">Manage email preferences</a>
      </td>
    </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 12px !important; }
      .content-box { padding: 24px 18px !important; }
      .header-logo { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preheader text hidden in inbox preview -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: #f4f6f8;">
    ${preheader}
  </div>

  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f6f8; padding: 24px 0 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table class="container" width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 18px rgba(24,98,63,0.06); border: 1px solid rgba(24,98,63,0.08);">
          
          <!-- Top Yellow Accent Line -->
          <tr>
            <td height="5" style="background-color: #ffe95c; font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Green Brand Header -->
          <tr>
            <td style="background-color: #18623f; padding: 28px 36px; text-align: left;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <!-- Brand Name / Logo -->
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background-color: #ffe95c; width: 34px; height: 34px; border-radius: 8px; text-align: center; vertical-align: middle;">
                          <span style="font-size: 18px; font-weight: 900; color: #18623f; line-height: 34px;">₦</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <div class="header-logo" style="font-size: 22px; font-weight: 900; color: #fcfaf5; letter-spacing: -0.5px; text-transform: uppercase;">
                            TaxFilling<span style="color: #ffe95c;">.</span>
                          </div>
                          <div style="font-size: 11px; font-weight: 600; color: #d5f5c2; letter-spacing: 0.5px; text-transform: uppercase;">
                            Nigerian Tax & Compliance Portal
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="content-box" style="padding: 36px 36px 28px 36px; background-color: #ffffff;">
              ${badgeSection}

              <h1 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 800; color: #18623f; line-height: 1.35; letter-spacing: -0.3px;">
                ${title}
              </h1>

              <div style="font-size: 15px; line-height: 1.65; color: #374151;">
                ${contentHtml}
              </div>

              ${ctaButton}
              ${secondaryCta}
            </td>
          </tr>

          <!-- Security / Assurance Banner -->
          <tr>
            <td style="padding: 0 36px 24px 36px; background-color: #ffffff;">
              <div style="background-color: #fcfaf5; border: 1px solid rgba(24,98,63,0.12); border-radius: 12px; padding: 14px 18px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="24" valign="top" style="font-size: 16px;">🛡️</td>
                    <td style="padding-left: 10px; font-size: 12px; color: #4b5563; line-height: 1.5;">
                      <strong>Security Note:</strong> TaxFilling will never ask for your banking PIN or password via email. Verified by FIRS & State Tax Authorities.
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Dark Green Footer -->
          <tr>
            <td style="background-color: #0f3e27; padding: 28px 36px; color: #fcfaf5;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="font-size: 12px; line-height: 1.6; color: rgba(252,250,245,0.85); text-align: center;">
                    <strong style="color: #ffffff;">TaxFilling Nigeria</strong> &bull; Victoria Island, Lagos &bull; FCT Abuja<br />
                    Questions or support? Reply directly or email <a href="mailto:support@taxfiling.com.ng" style="color: #ffe95c; text-decoration: underline;">support@taxfiling.com.ng</a><br />
                    Phone: +234 (0) 1 234 5678 (Mon–Fri, 8am–5pm WAT)
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 14px; font-size: 11px; color: rgba(252,250,245,0.55); text-align: center;">
                    &copy; ${currentYear} TaxFilling. Official Personal Income Tax, E-Invoicing & Rent Relief Platform. All rights reserved.
                  </td>
                </tr>
                ${marketingFooter}
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
