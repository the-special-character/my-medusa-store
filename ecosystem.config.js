module.exports = {
  apps: [
    {
      name: "learning-dino-backend",
      script: "npm",
      args: "start",
    },
    {
      name: "learning-dino-admin",
      script: "npm",
      args: "run start:server",
    },
  ],
};
