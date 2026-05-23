import "dotenv/config";
import express from "express";
import {
  insertChurchMember,
  insertCitizenComplaint
} from "./submissions.js";
import {
  churchMemberSchema,
  citizenComplaintSchema
} from "./validation.js";

function fieldErrors(error) {
  return error.flatten().fieldErrors;
}

function parseOrReject(schema, body, response) {
  const result = schema.safeParse(body);

  if (!result.success) {
    response.status(422).json({
      error: "Review the highlighted fields and submit again.",
      fields: fieldErrors(result.error)
    });
    return null;
  }

  return result.data;
}

export function createApp({
  saveChurchMember = insertChurchMember,
  saveCitizenComplaint = insertCitizenComplaint
} = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ready" });
  });

  app.post("/api/church-members", async (request, response, next) => {
    const member = parseOrReject(churchMemberSchema, request.body, response);

    if (!member) {
      return;
    }

    try {
      await saveChurchMember(member);
      response.status(201).json({
        message: "Membership pledge recorded."
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/citizen-complaints", async (request, response, next) => {
    const complaint = parseOrReject(
      citizenComplaintSchema,
      request.body,
      response
    );

    if (!complaint) {
      return;
    }

    try {
      await saveCitizenComplaint(complaint);
      response.status(201).json({
        message: "Citizen complaint registered."
      });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", (_request, response) => {
    response.status(404).json({ error: "API route not found." });
  });

  app.use((error, _request, response, _next) => {
    if (error?.type === "entity.parse.failed") {
      response.status(400).json({ error: "Request body must be valid JSON." });
      return;
    }

    console.error(error);
    response.status(500).json({
      error: "The civic registry is unavailable. Try again shortly."
    });
  });

  return app;
}

const app = createApp();

export default app;

