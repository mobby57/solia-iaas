import fp from "fastify-plugin";
import { addAUserRepo, getAUserRepo, updateAUserRepo, deleteAUserRepo } from "../../../../repositories/user.js";

const userRoutes = async (fastify, opts) => {
  // Create a new user
  fastify.post("/", async (request, reply) => {
    try {
      const user = await addAUserRepo(fastify.dbConn, request.body);
      reply.status(201).send(user);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Get all users
  fastify.get("/", async (request, reply) => {
    try {
      const users = await fastify.dbConn.model("users").find().lean();
      reply.send(users);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Get user by id
  fastify.get("/:id", async (request, reply) => {
    try {
      const user = await getAUserRepo(fastify.dbConn, { _id: request.params.id });
      if (!user) return reply.status(404).send({ error: "User not found" });
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  // Update user by id
  fastify.put("/:id", async (request, reply) => {
    try {
      const updateResult = await updateAUserRepo(fastify.dbConn, { _id: request.params.id }, request.body);
      if (updateResult.modifiedCount === 0) return reply.status(404).send({ error: "User not found" });
      const updatedUser = await getAUserRepo(fastify.dbConn, { _id: request.params.id });
      reply.send(updatedUser);
    } catch (error) {
      reply.status(400).send({ error: error.message });
    }
  });

  // Delete user by id
  fastify.delete("/:id", async (request, reply) => {
    try {
      const deleteResult = await deleteAUserRepo(fastify.dbConn, { _id: request.params.id });
      if (deleteResult.deletedCount === 0) return reply.status(404).send({ error: "User not found" });
      reply.send({ message: "User deleted" });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });
};

export default fp(userRoutes);
