import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { addATenantRepo, getATenantRepo, updateATenantRepo, deleteATenantRepo } from "../../../../repositories/tenant.js";

const tenantRoutes = async (fastify, opts) => {
  // Create a new tenant
  fastify.post("/", async (request, reply) => {
    try {
      const tenant = await addATenantRepo(fastify.dbConn, request.body);
      reply.status(201).send(tenant);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Get all tenants
  fastify.get("/", async (request, reply) => {
    try {
      const tenants = await fastify.dbConn.model("tenants").find().lean();
      reply.send(tenants);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Get tenant by id
  fastify.get("/:id", async (request, reply) => {
    try {
      const tenant = await getATenantRepo(fastify.dbConn, { _id: request.params.id });
      if (!tenant) return reply.status(404).send({ error: "Tenant not found" });
      reply.send(tenant);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Update tenant by id
  fastify.put("/:id", async (request, reply) => {
    try {
      const updateResult = await updateATenantRepo(fastify.dbConn, { _id: request.params.id }, request.body);
      if (updateResult.modifiedCount === 0) return reply.status(404).send({ error: "Tenant not found" });
      const updatedTenant = await getATenantRepo(fastify.dbConn, { _id: request.params.id });
      reply.send(updatedTenant);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Delete tenant by id
  fastify.delete("/:id", async (request, reply) => {
    try {
      const deleteResult = await deleteATenantRepo(fastify.dbConn, { _id: request.params.id });
      if (deleteResult.deletedCount === 0) return reply.status(404).send({ error: "Tenant not found" });
      reply.send({ message: "Tenant deleted" });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });
};

export default fp(tenantRoutes);
