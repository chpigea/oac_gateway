const config = require('./config.js')
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());


app.all("/:service/{*any}", async (req, res) => {
  try {
    
    const serviceName = req.params.service;

    // Get services list
    const { data: services } = await axios.get(config.url_register);
    
    const matchingInstances = services.filter(item => item.name === serviceName);

    if (matchingInstances.length == 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    const randomInstance = matchingInstances[Math.floor(Math.random() * matchingInstances.length)];

    const { protocol, host, port } = randomInstance;
    const path = req.params.any ? req.params.any.join("/") : ""
    const url = `${protocol}://${host}:${port}/${path}`;
    var headers = req.headers
    headers['Cache-Control'] = "no-cache"
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers
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
