const config = require('./config.js')
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());


app.all("/:service/{*any}", async (req, res) => {
  try {
    // Get services list
    const { data: services } = await axios.get(config.url_register);
    const serviceName = req.params.service;

    if (!services[serviceName]) {
      return res.status(404).json({ error: "Service not found" });
    }

    const { host, port } = services[serviceName];
    const path = req.params[0] || "";
    const url = `${config.protocol}://${host}:${port}/${path}`;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: req.headers,
    });

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gateway error" });
  }
});

const PORT = config.port || 4000;
app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});
