const express = require('express');
const Role = require('../models/role'); // Modèle de rôle
const router = express.Router();

// Ajouter un rôle
router.post('/', async (req, res) => {
  try {
    const { type, description } = req.body;

    // Vérifiez si le rôle existe déjà
    const existingRole = await Role.findOne({ type });
    if (existingRole) {
      return res.status(400).send({ message: 'Ce rôle existe déjà' });
    }

    const role = new Role({ type, description });
    await role.save();
    res.status(201).send({ message: 'Rôle créé avec succès', role });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur interne', error: error.message });
  }
});

// Récupérer tous les rôles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).send(roles);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur interne', error: error.message });
  }
});

// Supprimer un rôle par ID
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).send({ message: 'Rôle introuvable' });
    }
    res.status(200).send({ message: 'Rôle supprimé avec succès', role });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur interne', error: error.message });
  }
});

module.exports = router;
