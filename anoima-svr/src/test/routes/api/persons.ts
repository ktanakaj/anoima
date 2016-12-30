/**
 * @file persons.tsのテスト。
 */
import * as assert from 'power-assert';
import * as events from 'events';
import * as express from 'express';
import * as httpMocks from 'node-mocks-http';
import { global, shardable } from '../../../models';

const router: express.Router = require('../../../routes/api/persons');

describe('/api/persons', () => {
	before(async function () {
		// sqliteへのテストデータ登録
		await global.sequelize.sync({ force: true });
		for (let db of shardable) {
			await db.sequelize.sync({ force: true });
		}
		let map = await global.PersonMap.create({ key: 'UNITTEST0000001', no: 0 });
		await shardable[0].Person.create({ id: map.id, ownerId: 999, name: 'test1', privacy: 'private' });
		map = await global.PersonMap.create({ key: 'UNITTEST0000002', no: 0 });
		await shardable[0].Person.create({ id: map.id, ownerId: 999, name: 'test2', privacy: 'public' });
		map = await global.PersonMap.create({ key: 'UNITTEST0000003', no: 1 });
		await shardable[1].Person.create({ id: map.id, ownerId: 999, name: 'test3', privacy: 'public' });
	});

	describe('/random', () => {
		it('should return random persons', (done) => {
			const req = httpMocks.createRequest({
				method: 'GET',
				url: '/random',
			});
			const res = httpMocks.createResponse({
				eventEmitter: events.EventEmitter
			});
			res.on('end', function () {
				const people = JSON.parse(res._getData());
				assert.equal(people.length, 2);
				done();
			});
			router(req, res, done);
		});
	});

	describe('/:key', () => {
		it('should return specified private person', (done) => {
			const req = httpMocks.createRequest({
				method: 'GET',
				url: '/UNITTEST0000001',
			});
			const res = httpMocks.createResponse({
				eventEmitter: events.EventEmitter
			});
			res.on('end', function () {
				const person = JSON.parse(res._getData());
				assert.equal(person.name, 'test1');
				assert.equal(person.map.key, 'UNITTEST0000001');
				done();
			});
			router(req, res, done);
		});

		it('should return specified public person', (done) => {
			const req = httpMocks.createRequest({
				method: 'GET',
				url: '/UNITTEST0000003',
			});
			const res = httpMocks.createResponse({
				eventEmitter: events.EventEmitter
			});
			res.on('end', function () {
				const person = JSON.parse(res._getData());
				assert.equal(person.name, 'test3');
				assert.equal(person.map.key, 'UNITTEST0000003');
				done();
			});
			router(req, res, done);
		});
	});
});