import express from 'express';
import type {
	IExecutionFlattedResponse,
	IExecutionResponse,
	IExecutionsListResponse,
} from '@/Interfaces';
import * as ResponseHelper from '@/ResponseHelper';
import type { ExecutionRequest } from '@/requests';
import { EEExecutionsController } from './executions.controller.ee';
import { ExecutionsService } from './executions.service';

export const executionsController = express.Router();
executionsController.use('/', EEExecutionsController);

/**
 * GET /executions
 */
executionsController.get(
	'/',
	ResponseHelper.send(async (req: ExecutionRequest.GetAll): Promise<IExecutionsListResponse> => {
		return ExecutionsService.getExecutionsList(req);
	}),
);

/**
 * GET /executions/:id
 */
executionsController.get(
	'/:id(\\d+)',
	ResponseHelper.send(
		async (
			req: ExecutionRequest.Get,
		): Promise<IExecutionResponse | IExecutionFlattedResponse | undefined> => {
			return ExecutionsService.getExecution(req);
		},
	),
);

/**
 * POST /executions/:id/retry
 */
executionsController.post(
	'/:id/retry',
	ResponseHelper.send(async (req: ExecutionRequest.Retry): Promise<boolean> => {
		return ExecutionsService.retryExecution(req);
	}),
);

/**
 * POST /executions/delete
 * INFORMATION: We use POST instead of DELETE to not run into any issues with the query data
 * getting too long
 */
executionsController.post(
	'/delete',
	ResponseHelper.send(async (req: ExecutionRequest.Delete): Promise<void> => {
		await ExecutionsService.deleteExecutions(req);
	}),
);
