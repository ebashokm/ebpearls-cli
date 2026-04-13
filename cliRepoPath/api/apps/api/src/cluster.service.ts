import { Injectable } from '@nestjs/common';
const cluster = require('cluster');

/* 
For dynamic clustering

import * as os from 'os';
const numCPUs = os.cpus().length;
*/
const numCPUs = 1;

@Injectable()
export class ClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isMaster) {
      console.log(`Master process is running with PID: ${process.pid}`);
      console.log(`Forking ${numCPUs} workers...`);

      // Array to keep track of active workers
      const activeWorkers = [];

      for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork(); // Fork a worker
        activeWorkers.push(worker); // Add the worker to the active workers array
        console.log(`Worker ${worker.process.pid} is forked`);
      }

      cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
        console.log(`Current active workers: ${activeWorkers.length}`);
      });

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}.`);

        // Remove the exited worker from the active workers array
        const index = activeWorkers.findIndex((w) => w.process.pid === worker.process.pid);
        if (index !== -1) {
          activeWorkers.splice(index, 1);
        }

        // Fork a new worker and add it to the array
        const newWorker = cluster.fork();
        activeWorkers.push(newWorker);
        console.log(`Forked a new worker with PID: ${newWorker.process.pid}`);
        console.log(`Current active workers: ${activeWorkers.length}`);
      });
    } else {
      // In the worker process, call the callback function to start your NestJS application
      callback();
    }
  }
}
