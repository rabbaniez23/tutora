import type { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from './auth.service';
import type {
  RegisterInput,
  LoginInput,
  OtpSendInput,
  OtpVerifyInput,
  RefreshInput,
  TeacherRegisterInput,
  TeacherKycInput,
  TeacherDocumentsInput,
  TeacherVideoInput,
} from './auth.schema';

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply,
) {
  const result = await authService.register(request.body);
  return reply.status(201).send({
    message: 'Registration successful',
    ...result,
  });
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;
  const result = await authService.login(email, password);
  return reply.send({
    message: 'Login successful',
    ...result,
  });
}

export async function logoutHandler(
  request: FastifyRequest<{ Body: RefreshInput }>,
  reply: FastifyReply,
) {
  await authService.logout(request.body.refreshToken);
  return reply.send({ message: 'Logged out successfully' });
}

export async function refreshHandler(
  request: FastifyRequest<{ Body: RefreshInput }>,
  reply: FastifyReply,
) {
  const result = await authService.refreshToken(request.body.refreshToken);
  return reply.send({
    message: 'Token refreshed successfully',
    ...result,
  });
}

export async function otpSendHandler(
  request: FastifyRequest<{ Body: OtpSendInput }>,
  reply: FastifyReply,
) {
  const result = await authService.sendOTP(request.body.phone);
  return reply.send(result);
}

export async function otpVerifyHandler(
  request: FastifyRequest<{ Body: OtpVerifyInput }>,
  reply: FastifyReply,
) {
  const result = await authService.verifyOTP(request.body.phone, request.body.code);
  return reply.send(result);
}

export async function teacherRegisterHandler(
  request: FastifyRequest<{ Body: TeacherRegisterInput }>,
  reply: FastifyReply,
) {
  const result = await authService.registerTeacher(request.body);
  return reply.status(201).send({
    message: 'Teacher registration successful',
    ...result,
  });
}

export async function teacherKycHandler(
  request: FastifyRequest<{ Body: TeacherKycInput }>,
  reply: FastifyReply,
) {
  const result = await authService.submitKyc(request.user.id, request.body);
  return reply.send({
    message: 'KYC submitted successfully',
    data: result,
  });
}

export async function teacherDocumentsHandler(
  request: FastifyRequest<{ Body: TeacherDocumentsInput }>,
  reply: FastifyReply,
) {
  const result = await authService.submitDocuments(request.user.id, request.body.documentUrls);
  return reply.send({
    message: 'Documents submitted successfully',
    data: result,
  });
}

export async function teacherVideoHandler(
  request: FastifyRequest<{ Body: TeacherVideoInput }>,
  reply: FastifyReply,
) {
  const result = await authService.submitVideo(request.user.id, request.body.videoUrl);
  return reply.send({
    message: 'Video submitted successfully, awaiting review',
    data: result,
  });
}
