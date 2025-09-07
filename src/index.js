const config = require('./config.js')
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());          // parses application/json
app.use(express.urlencoded({ extended: true })); // parses application/x-www-form-urlencoded


app.all("/:service/{*any}", async (req, res, next) => {
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
    const url = `${protocol}://${host}:${port}/${serviceName}/${path}`;
    var headers = req.headers
    delete headers['host'];
    delete headers['content-length'];
    headers['Cache-Control'] = "no-cache"

    let options = {
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers,
      maxRedirects: 0,
      responseType: "stream"
    }
    const response = await axios(options);
    for (const key in response.headers) {
      res.setHeader(key, response.headers[key]);
    }
    res.status(response.status);
    response.data.pipe(res);
  } catch (err) {
    if (err.response && err.response.status >= 300 && err.response.status < 400) {
      // This is a redirect: forward it
      return res
        .status(err.response.status)
        .set('Location', err.response.headers.location)
        .send();
    }
    // Other errors
    next(err);
    //res.status(500).json({ error: `Gateway error: ${err}` });
  }
});

const PORT = config.port || 4000;
app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});
