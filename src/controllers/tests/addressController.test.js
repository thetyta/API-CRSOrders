import addressController from '../addressController.js';

describe('addressController', () => {
  describe('get', () => {
    it('deve retornar todos os endereços quando nenhum ID é fornecido', async () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await addressController.get(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Dados encontrados',
          data: expect.any(Array)
        })
      );
    });
  });
  describe('get com ID', () => {
    it('deve retornar um endereço específico quando um ID válido é fornecido', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await addressController.get(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Dados encontrados',
          data: expect.any(Object)
        })
      );
    });

    it('deve retornar 404 se o endereço não for encontrado', async () => {
      const req = { params: { id: '999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await addressController.get(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('not found');
    });
  });
  describe('create', () => {
    it('deve criar um novo endereço com dados válidos', async () => {
      const req = {
        user: { id: 1, role: 'user' },
        body: {
          street: 'Rua A',
          number: '123',
          neighborhood: 'BairroB',
          city: 'Cidade',
          state: 'Estado',
          zipCode: '12345678',
          idUser: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await addressController.persist(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'criado com sucesso!',
          data: expect.any(Object)
        })
      );
    });
  });
});