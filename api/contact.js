// Serverless function para Vercel: envía el formulario de contacto usando Resend.
// Configura la variable de entorno RESEND_API_KEY en Vercel (y opcionalmente RESEND_FROM y CONTACT_EMAIL).

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY no está configurada." });
    }

    const from = process.env.RESEND_FROM || "Jareth Rosero <onboarding@resend.dev>";
    const to = process.env.CONTACT_EMAIL || "jareth.rosero08@somo.eus";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Nuevo mensaje desde el portfolio de ${name}`,
        reply_to: email,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    const data = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      return res.status(resendResponse.status).json({
        error: data.message || data.error || "Error al enviar con Resend.",
      });
    }

    return res.status(200).json({ id: data.id, message: "Mensaje enviado correctamente." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error interno del servidor." });
  }
};
