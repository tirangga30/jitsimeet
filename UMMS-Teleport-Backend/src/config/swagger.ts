const json = { "application/json": { schema: { type: "object", additionalProperties: true } } };
const response = (description: string) => ({ description, content: json });
const body = (required = true) => ({ required, content: json });
const schemaBody = (schema: string, example: Record<string, unknown>, required = true) => ({
  required,
  content: { "application/json": { schema: { $ref: `#/components/schemas/${schema}` }, example } },
});
const id = (name = "id") => [{ name, in: "path", required: true, schema: { type: "string" } }];

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "UMMS Teleport API",
    version: "1.0.0",
    description: "Interactive documentation for the UMMS Inpatient / Teleport backend.",
  },
  servers: [
    { url: "https://api.meet.bulmartech.com", description: "Production" },
    { url: "http://localhost:4000", description: "Local development" },
  ],
  tags: [
    { name: "System" }, { name: "Invitations" }, { name: "Patients" },
    { name: "Providers" }, { name: "Family & Friends" }, { name: "EMR" }, { name: "Spaces" },
  ],
  components: {
    schemas: {
      InvitationMember: {
        type: "object", required: ["id", "name", "relation", "phone", "email", "type"],
        properties: { id: { type: "string" }, name: { type: "string" }, relation: { type: "string" }, phone: { type: "string" }, email: { type: "string", format: "email" }, type: { type: "string", enum: ["provider", "guest"], description: "Family and friends use the guest meeting role." } },
      },
      CreateInvitations: {
        type: "object", required: ["patientId", "members"],
        properties: { patientId: { type: "string" }, members: { type: "array", items: { $ref: "#/components/schemas/InvitationMember" } }, roomId: { type: "string" }, inviteBatchId: { type: "string" } },
      },
      AcceptInvitation: { type: "object", required: ["inviteId"], properties: { inviteId: { type: "string" } } },
      Patient: {
        type: "object",
        properties: {
          firstName: { type: "string" }, lastName: { type: "string" }, gender: { type: "string" }, age: { type: "integer" },
          dob: { type: "string", format: "date" }, medicareNumber: { type: "string" }, MRN: { oneOf: [{ type: "integer" }, { type: "string" }] },
          CBEN: { oneOf: [{ type: "integer" }, { type: "string" }] }, phone: { type: "string" }, currentStatus: { type: "string" },
          deviceAssociated: { type: "string" }, imageUrl: { type: "string", format: "uri" },
          providerIds: { type: "array", items: { type: "string", format: "uuid" } }, familyIds: { type: "array", items: { type: "string", format: "uuid" } },
        },
      },
      Provider: {
        type: "object",
        properties: { firstName: { type: "string" }, lastName: { type: "string" }, email: { type: "string", format: "email" }, phone: { type: "string" }, designation: { type: "string" }, status: { type: "string" }, department: { type: "string", nullable: true }, providerType: { type: "string", nullable: true }, location: { type: "string", nullable: true } },
      },
      FamilyFriend: {
        type: "object",
        properties: { firstName: { type: "string" }, lastName: { type: "string" }, email: { type: "string", format: "email" }, phone: { type: "string" }, relation: { type: "string" }, status: { type: "string" }, invite: { type: "boolean" } },
      },
      EmrImage: {
        type: "object", required: ["patientId", "firstName", "lastName", "dob", "gender", "visitId", "fileType", "imageBase64"],
        properties: { patientId: { type: "string" }, firstName: { type: "string" }, lastName: { type: "string" }, dob: { type: "string", example: "19650811" }, gender: { type: "string" }, visitId: { type: "string" }, fileType: { type: "string", example: "PNG" }, imageBase64: { type: "string", format: "byte" } },
      },
    },
  },
  paths: {
    "/health": { get: { tags: ["System"], summary: "Health check", responses: { "200": response("Service is healthy") } } },
    "/api/invitations/create": { post: { tags: ["Invitations"], summary: "Create invitations", requestBody: schemaBody("CreateInvitations", { patientId: "302", members: [{ name: "Simon", relation: "Father", mobile: "123", email: "simon@test.com" }, { name: "Daniel", relation: "Friend", mobile: "456", email: "daniel@test.com" }] }), responses: { "201": response("Invitations created"), "400": response("Invalid input") } } },
    "/api/invitations/accept": { post: { tags: ["Invitations"], summary: "Accept an invitation", requestBody: schemaBody("AcceptInvitation", { inviteId: "inv_9c3a5da9" }), responses: { "200": response("Invitation accepted"), "400": response("Invalid input") } } },
    "/api/invitations/status": { get: { tags: ["Invitations"], summary: "Get invitation batch status", parameters: [{ name: "inviteBatchId", in: "query", required: true, schema: { type: "string" } }], responses: { "200": response("Batch status") } } },
    "/api/invitations/active": { get: { tags: ["Invitations"], summary: "Get a patient's active invitation", parameters: [{ name: "patientId", in: "query", required: true, schema: { type: "string" } }], responses: { "200": response("Active invitation") } } },
    "/api/invitations/invite/{inviteId}": { get: { tags: ["Invitations"], summary: "Get invitation details", parameters: id("inviteId"), responses: { "200": response("Invitation details"), "404": response("Not found") } } },
    "/api/invitations/send-sms": { post: { tags: ["Invitations"], summary: "Send an SMS", requestBody: body(), responses: { "200": response("SMS sent") } } },
    "/api/invitations/waiting-room-reminder": { post: { tags: ["Invitations"], summary: "Send waiting-room reminder", requestBody: body(), responses: { "200": response("Reminder sent") } } },
    "/api/invitations/nudge-guests": { post: { tags: ["Invitations"], summary: "Nudge meeting guests", requestBody: body(), responses: { "200": response("Guests nudged") } } },
    "/api/invitations/leave": { post: { tags: ["Invitations"], summary: "Leave a meeting", requestBody: body(), responses: { "200": response("Meeting left") } } },
    "/api/invitations/conclude": { post: { tags: ["Invitations"], summary: "Conclude a meeting", requestBody: body(), responses: { "200": response("Meeting concluded") } } },
    "/api/patients": {
      get: { tags: ["Patients"], summary: "List patients", responses: { "200": response("Patient list") } },
      post: { tags: ["Patients"], summary: "Create a patient", requestBody: schemaBody("Patient", { firstName: "Ashley", lastName: "Testpatient", gender: "Female", age: 45, dob: "1980-01-15", medicareNumber: "5080483241", MRN: 2001320978, CBEN: 5088152896, phone: "9876543210", currentStatus: "NAN", deviceAssociated: "No", imageUrl: "https://example.com/profile.jpg", providerIds: ["3c1141e1-c83d-448a-9c43-e029f9f8fc2d"], familyIds: ["c5a0368c-aee2-49f8-9ff1-5ab6225c027b"] }), responses: { "201": response("Patient created"), "400": response("Invalid input") } },
    },
    "/api/patients/{id}": {
      get: { tags: ["Patients"], summary: "Get a patient", parameters: id(), responses: { "200": response("Patient details"), "404": response("Not found") } },
      patch: { tags: ["Patients"], summary: "Update a patient", parameters: id(), requestBody: schemaBody("Patient", { deviceAssociated: "Yes", currentStatus: "NAN" }), responses: { "200": response("Patient updated"), "404": response("Not found") } },
    },
    "/api/patients/{id}/meetings": {
      get: {
        tags: ["Patients"],
        summary: "List patient meetings",
        description: "Returns meetings newest first using cursor pagination.",
        parameters: [
          ...id(),
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
          { name: "cursor", in: "query", schema: { type: "string" }, description: "The nextCursor from the previous response." },
        ],
        responses: { "200": response("Paginated meeting list"), "400": response("Invalid limit or cursor") },
      },
    },
    "/api/providers": {
      get: { tags: ["Providers"], summary: "List providers", responses: { "200": response("Provider list") } },
      post: { tags: ["Providers"], summary: "Create a provider", requestBody: schemaBody("Provider", { firstName: "Sam", lastName: "Taylor", email: "test+6@gmail.com", phone: "1234567896", designation: "PA-C", status: "-", department: "Emergency Medicine", providerType: "Physician Assistant", location: "UHM" }), responses: { "201": response("Provider created") } },
    },
    "/api/providers/{id}": {
      get: { tags: ["Providers"], summary: "Get a provider", parameters: id(), responses: { "200": response("Provider details"), "404": response("Not found") } },
      patch: { tags: ["Providers"], summary: "Update a provider", parameters: id(), requestBody: schemaBody("Provider", { firstName: "Daniel", lastName: "Lawrence", designation: "MD", department: "Virtual Nursing", providerType: "Nurse", location: "UHM" }), responses: { "200": response("Provider updated") } },
    },
    "/api/family-friends": {
      get: { tags: ["Family & Friends"], summary: "List family and friends", responses: { "200": response("Contact list") } },
      post: { tags: ["Family & Friends"], summary: "Create a family/friend contact", requestBody: schemaBody("FamilyFriend", { firstName: "Dan", lastName: "Lorain", email: "test+2@gmail.com", phone: "1234567892", relation: "Friend", status: "-" }), responses: { "201": response("Contact created") } },
    },
    "/api/family-friends/{id}": {
      get: { tags: ["Family & Friends"], summary: "Get a family/friend contact", parameters: id(), responses: { "200": response("Contact details"), "404": response("Not found") } },
      patch: { tags: ["Family & Friends"], summary: "Update a family/friend contact", parameters: id(), requestBody: schemaBody("FamilyFriend", { status: "sent", invite: false }), responses: { "200": response("Contact updated") } },
    },
    "/api/emr/upload-image": { post: { tags: ["EMR"], summary: "Upload an EMR image", requestBody: schemaBody("EmrImage", { patientId: "Z4063100", firstName: "ANGELA", lastName: "WILLIAMS", dob: "19650811", gender: "F", visitId: "5168053799", fileType: "PNG", imageBase64: "iVBORw0KGgoAAAANSUhEUg..." }), responses: { "200": response("Image uploaded") } } },
    "/api/emr/images": { get: { tags: ["EMR"], summary: "List EMR images", parameters: [{ name: "patientId", in: "query", schema: { type: "string" } }], responses: { "200": response("Image list") } } },
    "/api/spaces/upload": { post: { tags: ["Spaces"], summary: "Upload a file", requestBody: { required: true, content: { "multipart/form-data": { schema: { type: "object", properties: { file: { type: "string", format: "binary" }, folder: { type: "string" } }, required: ["file"] } }, ...json } }, responses: { "200": response("File uploaded") } } },
    "/api/spaces/files": { get: { tags: ["Spaces"], summary: "List files", parameters: [{ name: "folder", in: "query", required: true, schema: { type: "string" } }], responses: { "200": response("File list") } } },
  },
};
