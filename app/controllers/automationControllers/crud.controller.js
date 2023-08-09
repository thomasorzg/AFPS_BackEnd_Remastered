const db = require("../../models");

exports.create = async (req, res) => {
  try {
    const data = await db[req.params.document].create(req.body);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    var condition = {};
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);

    if (offset >= 0 && limit >= 0) {
      condition.offset = offset;
      condition.limit = limit;
    }

    const data = await db[req.params.document].findAll(condition);
    
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await db[req.params.document].findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(400).send({
        message: "Error retrieving record with id=" + id,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const num = await db[req.params.document].update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      res.send({
        message: "Updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update with id=${id}. Maybe record was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const document = req.params.document;

    const num = await db[document].destroy({
      where: { id: id },
    });

    if (num == 1) {
      res.send({
        message: "Deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete with id=${id}. Maybe record was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const nums = await db[req.params.document]
    .destroy({
      where: {},
      truncate: false,
    })

    if (nums > 0) {
      res.send({ message: `${nums} records were deleted successfully!` });
    } else {
      res.status(400).send({ message: "No records found to delete." });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
