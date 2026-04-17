import { resend, FROM } from "./resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://testiflow.com";

function baseTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        <div style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:28px 32px">
          <p style="margin:0;color:#fff;font-size:20px;font-weight:700">⚡ TestiFlow</p>
        </div>
        <div style="padding:32px">
          ${content}
        </div>
        <div style="padding:20px 32px;border-top:1px solid #f3f4f6;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">
            TestiFlow · <a href="${APP_URL}" style="color:#7c3aed;text-decoration:none">testiflow.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendWelcomeEmail(email: string, name?: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "¡Bienvenido a TestiFlow! 🚀",
    html: baseTemplate(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#111">
        ¡Hola${name ? ` ${name}` : ""}! 👋
      </h1>
      <p style="margin:0 0 16px;color:#374151;line-height:1.6">
        Ya tienes acceso a TestiFlow. Ahora puedes crear tu primer Espacio y empezar a recolectar testimonios de tus clientes.
      </p>
      <a href="${APP_URL}/dashboard" style="
        display:inline-block;background:#7c3aed;color:#fff;
        padding:12px 24px;border-radius:8px;text-decoration:none;
        font-weight:600;font-size:14px;margin:8px 0 16px
      ">Ir al Dashboard</a>
      <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6">
        En el plan Free tienes hasta 10 testimonios aprobados. ¡Empieza ahora!
      </p>
    `),
  });
}

export async function sendTestimonialRequestEmail({
  toEmail,
  toName,
  fromName,
  spaceName,
  wallUrl,
}: {
  toEmail: string;
  toName?: string;
  fromName?: string;
  spaceName: string;
  wallUrl: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `${fromName ?? "Alguien"} te pide tu opinión ⭐`,
    html: baseTemplate(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#111">
        Hola${toName ? ` ${toName}` : ""}! 👋
      </h1>
      <p style="margin:0 0 16px;color:#374151;line-height:1.6">
        <strong>${fromName ?? "Un cliente"}</strong> te invita a dejar tu testimonio sobre <strong>${spaceName}</strong>.
        Solo toma 1 minuto. ¡Tu opinión significa mucho!
      </p>
      <a href="${wallUrl}" style="
        display:inline-block;background:#7c3aed;color:#fff;
        padding:12px 24px;border-radius:8px;text-decoration:none;
        font-weight:600;font-size:14px;margin:8px 0 16px
      ">Dejar mi testimonio</a>
      <p style="margin:0;color:#9ca3af;font-size:12px">
        O copia este link: ${wallUrl}
      </p>
    `),
  });
}

export async function sendTestimonialConfirmationEmail(
  toEmail: string,
  spaceName: string
) {
  return resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: "¡Gracias por tu testimonio! ✨",
    html: baseTemplate(`
      <h1 style="margin:0 0 16px;font-size:22px;color:#111">
        ¡Gracias! 🙏
      </h1>
      <p style="margin:0 0 16px;color:#374151;line-height:1.6">
        Hemos recibido tu testimonio para <strong>${spaceName}</strong>.
        Será revisado y publicado pronto.
      </p>
      <p style="margin:0;color:#6b7280;font-size:13px">
        ¡Gracias por tomarte el tiempo!
      </p>
    `),
  });
}
