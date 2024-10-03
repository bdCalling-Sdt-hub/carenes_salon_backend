// import mongoose from 'mongoose';
// import app from './app';
// import config from './app/config';
// import { Server } from 'http';
// // import seedSuperAdmin from './app/DB';

// let server: Server;

// async function main() {
//   try {
//     await mongoose.connect(config.database_url as string);
//     // seedSuperAdmin();
//     server = app.listen(config.port, () => {
//       console.log(`First app listening on port ${config.port}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();

// process.on('unhandledRejection', () => {
//   console.log('unhandledRejection is detected shutting down the server');
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });

// process.on('uncaughtException', () => {
//   console.log('uncaughtException is detected ');
//   process.exit(1);
// });

import mongoose from 'mongoose';
import { Server as HTTPServer } from 'http'; // Import HTTPServer type
import server from './app';
import { errorLogger, logger } from './app/shared/logger';
import config from './app/config';

process.on('uncaughtException', (error) => {
  errorLogger.error('Uncaught Exception:', error);
  process.exit(1);
});

let myServer: HTTPServer | undefined;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('DB Connected Successfully');

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);
    myServer = server.listen(port, config.base_url as string, () => {
      logger.info(
        `Example app listening on port http://192.168.10.153:${config.port}`,
      );
    });
  } catch (error) {
    errorLogger.error('Error in main function:', error);
    throw error;
  }

  process.on('unhandledRejection', (error) => {
    if (myServer) {
      myServer.close(() => {
        errorLogger.error('Unhandled Rejection:', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main().catch((err) => errorLogger.error('Main function error:', err));

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received');
  if (myServer) {
    myServer.close(() => {
      logger.info('Server closed gracefully');
    });
  }
});
