require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const { Resend } = require("resend");

const app = express();

const PORT = Number(process.env.PORT || 5000);

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:8080";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_FROM_NAME =
  process.env.RESEND_FROM_NAME ||
  "Sun Faith Energy Solutions";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;

// ==================================================
// ENVIRONMENT CHECK
// ==================================================

if (
  !RESEND_API_KEY ||
  !RESEND_FROM_EMAIL ||
  !CONTACT_TO_EMAIL
) {
  console.error(
    "Missing RESEND_API_KEY, RESEND_FROM_EMAIL or CONTACT_TO_EMAIL."
  );

  process.exit(1);
}

// ==================================================
// RESEND
// ==================================================

const resend = new Resend(RESEND_API_KEY);

// ==================================================
// ALLOWED REQUIREMENTS
// ==================================================

const requirements = [
  "Residential Solar",
  "Commercial Solar",
  "Industrial Solar",
  "Installation",
  "Maintenance",
  "General Consultation",
];

// ==================================================
// VALIDATION
// ==================================================

const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name is too long."),

  phone: z
    .string()
    .trim()
    .transform((value) =>
      value.replace(/[\s()+-]/g, "")
    )
    .refine(
      (value) => /^[6-9]\d{9}$/.test(value),
      "Invalid Indian mobile number."
    ),

  email: z
    .string()
    .trim()
    .max(160, "Email is too long.")
    .optional()
    .or(z.literal(""))
    .refine(
      (value) =>
        !value ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Invalid email."
    ),

  requirement: z.enum(requirements),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message is too long."),

  // Honeypot field
  website: z
    .string()
    .max(0)
    .optional(),
});

// ==================================================
// HTML ESCAPE
// ==================================================

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ==================================================
// SECURITY
// ==================================================

app.disable("x-powered-by");

app.use(helmet());

// ==================================================
// CORS
// ==================================================

const allowedOrigins = CLIENT_URL
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

// Development origins
if (!allowedOrigins.includes("http://localhost:8080")) {
  allowedOrigins.push("http://localhost:8080");
}

if (!allowedOrigins.includes("http://localhost:5173")) {
  allowedOrigins.push("http://localhost:5173");
}

console.log(
  "Allowed CORS origins:",
  allowedOrigins
);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without Origin header
      // are allowed.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        "Blocked CORS origin:",
        origin
      );

      return callback(
        new Error("CORS origin not allowed")
      );
    },

    methods: [
      "GET",
      "POST",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
    ],
  })
);

// ==================================================
// JSON BODY
// ==================================================

app.use(
  express.json({
    limit: "20kb",
    strict: true,
  })
);

// ==================================================
// RATE LIMIT
// ==================================================

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many enquiries. Please try again later.",
  },
});

// ==================================================
// HEALTH CHECK
// ==================================================

app.get(
  "/api/health",
  (_req, res) => {
    res.json({
      success: true,
      status: "ok",
      service:
        "sun-faith-energy-backend",
    });
  }
);

// ==================================================
// CONTACT FORM
// ==================================================

app.post(
  "/api/contact",
  contactLimiter,
  async (req, res) => {
    try {
      console.log(
        "Contact request received:",
        {
          name: req.body?.name,
          phone: req.body?.phone,
          email: req.body?.email,
          requirement:
            req.body?.requirement,
          messageLength:
            typeof req.body?.message ===
            "string"
              ? req.body.message.length
              : undefined,
        }
      );

      // ----------------------------------------------
      // VALIDATE REQUEST
      // ----------------------------------------------

      const parsed =
        enquirySchema.safeParse(
          req.body
        );

      if (!parsed.success) {
        const validationErrors =
          parsed.error.flatten()
            .fieldErrors;

        console.error(
          "Validation error:",
          JSON.stringify(
            validationErrors,
            null,
            2
          )
        );

        return res.status(400).json({
          success: false,
          message:
            "Please check the form details and try again.",
          errors: validationErrors,
        });
      }

      const data = parsed.data;

      // ----------------------------------------------
      // HONEYPOT
      // ----------------------------------------------

      if (data.website) {
        console.warn(
          "Honeypot triggered."
        );

        return res.status(400).json({
          success: false,
          message:
            "Unable to process this request.",
        });
      }

      // ----------------------------------------------
      // ESCAPE DATA
      // ----------------------------------------------

      const name = escapeHtml(
        data.name
      );

      const phone = escapeHtml(
        data.phone
      );

      const email = escapeHtml(
        data.email || "Not provided"
      );

      const requirement =
        escapeHtml(
          data.requirement
        );

      const message =
        escapeHtml(data.message)
          .replace(
            /\r?\n/g,
            "<br>"
          );

      // ----------------------------------------------
      // RESEND
      // ----------------------------------------------

      console.log(
        "Sending enquiry through Resend..."
      );

      const result =
        await resend.emails.send({
          from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,

          to: [
            CONTACT_TO_EMAIL,
          ],

          replyTo:
            data.email || undefined,

          subject:
            `New Solar Enquiry — ${data.requirement} — ${data.name}`,

          html: `
            <div
              style="
                font-family: Arial, sans-serif;
                max-width: 680px;
                margin: 30px auto;
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 16px;
                overflow: hidden;
                color: #101a27;
              "
            >

              <div
                style="
                  background: #101a27;
                  color: #ffffff;
                  padding: 24px;
                "
              >

                <div
                  style="
                    color: #facc15;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                  "
                >
                  NEW WEBSITE ENQUIRY
                </div>

                <h2
                  style="
                    margin: 8px 0 0;
                  "
                >
                  Sun Faith Energy Solutions
                </h2>

              </div>

              <div
                style="
                  padding: 28px;
                "
              >

                <p>
                  <strong>Name:</strong>
                  ${name}
                </p>

                <p>
                  <strong>Phone:</strong>
                  ${phone}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${email}
                </p>

                <p>
                  <strong>Requirement:</strong>
                  ${requirement}
                </p>

                <div
                  style="
                    margin-top: 22px;
                    padding: 18px;
                    background: #f8fafc;
                    border-radius: 12px;
                  "
                >

                  <strong>
                    Message
                  </strong>

                  <p
                    style="
                      line-height: 1.7;
                    "
                  >
                    ${message}
                  </p>

                </div>

                <p
                  style="
                    font-size: 12px;
                    color: #64748b;
                    margin-top: 24px;
                  "
                >
                  Submitted through the
                  Sun Faith Energy Solutions
                  website.
                </p>

              </div>
            </div>
          `,
        });

      // ----------------------------------------------
      // RESEND ERROR
      // ----------------------------------------------

      if (result.error) {
        console.error(
          "Resend error:",
          result.error
        );

        return res.status(502).json({
          success: false,
          message:
            "Unable to send your enquiry right now. Please call or WhatsApp us.",
        });
      }

      // ----------------------------------------------
      // SUCCESS
      // ----------------------------------------------

      console.log(
        "Enquiry sent successfully:",
        result.data
      );

      return res.json({
        success: true,
        message:
          "Your enquiry has been sent successfully.",
      });

    } catch (error) {
      console.error(
        "Contact API error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong. Please try again later.",
      });
    }
  }
);

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use(
  (
    error,
    _req,
    res,
    _next
  ) => {

    // CORS
    if (
      error.message ===
      "CORS origin not allowed"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Origin not allowed.",
      });
    }

    // Invalid JSON
    if (
      error.type ===
      "entity.parse.failed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid request body.",
      });
    }

    console.error(
      "Unhandled server error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
);

// ==================================================
// START SERVER
// ==================================================

app.listen(
  PORT,
  () => {
    console.log(
      `Sun Faith backend running on http://localhost:${PORT}`
    );

    console.log(
      `Contact endpoint: http://localhost:${PORT}/api/contact`
    );
  }
);