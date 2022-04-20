const cluster = require('cluster');

// eslint-disable-next-line space-before-function-paren
function startWorker() {
  const worker = cluster.fork();
  console.log(`CLUSTER: Worker id: ${worker.id} started`);
}

if (cluster.isMaster) {
  require('os')
    .cpus()
    .forEach(function () {
      startWorker();
    });

  cluster.on('disconnect', function (worker) {
    console.log(
      `CLUSTER: Worker id ${worker.id} is disconnected from cluster.`
    );
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log(
      `CLUSTER: Worker id ${worker.id} died with exit code ${code} {${signal}}`
    );
    startWorker();
  });
} else {
  require('./meadowlark.js')();
}
