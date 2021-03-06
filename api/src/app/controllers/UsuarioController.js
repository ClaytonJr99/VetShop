import * as Yup from 'yup';
import Usuario from '../models/Usuario';

class UsuarioController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(8),
      telefone: Yup.string().required(),
      bairro: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      cpf: Yup.string().required(),
      provider: Yup.boolean(),

    })

    const existsCpf = await Usuario.findOne({ where: { cpf: req.body.cpf } })

    if (existsCpf) {
      return res.status(400).json({ error: 'CPF já utilizado' })
    }

    const existsemail = await Usuario.findOne({ where: { cpf: req.body.email } })

    if (existsemail) {
      return res.status(400).json({ error: 'E-mail já utilizado' })
    }



    try {
      await schema.validate(req.body)
    }
    catch (erro) {
      res.status(400).json(erro.errors)
    }


    const { id, nome, email, senha, telefone, bairro, rua, numero, cpf, provider } = await Usuario.create(req.body);

    return res.json({
      id,
      nome,
      email,
      senha,
      telefone,
      bairro,
      rua,
      numero,
      cpf,
      provider
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      senha: Yup.string(),
      telefone: Yup.string(),
      bairro: Yup.string(),
      rua: Yup.string(),
      numero: Yup.string(),
      cpf: Yup.string(),
      usuarioId: Yup.number().required(),
      provider: Yup.boolean(),
    })

    try {
      await schema.validate(req.body)
    }
    catch (erro) {
      res.status(400).json(erro.errors)
    }

    const usuario = await Usuario.findByPk(req.body.usuarioId);

    const { id, nome, email, senha, telefone, bairro, rua, numero, cpf, provider } = await usuario.update(req.body);

    return res.json({
      id,
      nome,
      email,
      senha,
      telefone,
      bairro,
      rua,
      numero,
      cpf,
      provider,
    });
  }

  async index(req, res) {
    const usuarios = await Usuario.findAll();

    return res.json(usuarios);
  }

  async show(req, res) {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      res.json(usuario);
    }
    else {
      res.json({ message: 'Usuario não encontrado' })
    }

  }

  async delete(req, res) {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      usuario.destroy();
      res.json({ message: 'Usuario removido com sucesso' })
    }
    else {
      res.json({ message: 'Usuario não encontrado' })
    }

  }
}

export default new UsuarioController();
