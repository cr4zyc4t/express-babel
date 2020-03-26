import path from 'path';
import http from 'http';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import log4js from 'log4js';

import homeRouter from './routes';
import userRouter from './routes/users';
import logConfig from './config/log4js.json';

const port = parseInt(process.env.PORT) || 3000;

log4js.configure(logConfig);
const log = log4js.getLogger('app');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.set('port', port);

app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', homeRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const server = http.createServer(app);
server.on('error', (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? `Pipe ${port}`
		: `Port ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
});

server.on('listening', () => {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? `pipe ${addr}`
		: `http://localhost:${addr.port}`;
	log.info(`Listening on ${bind}`);
});

server.listen(port);