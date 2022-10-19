const express = require("express");

const checklistDependentRoute = express.Router();
const simpleRouter = express.Router();
const Checklist = require("../models/checklist");
const Task = require("../models/task");

checklistDependentRoute.get("/:id/tasks/new", async (req, res) => {
  try {
    let task = Task();
    res
      .status(200)
      .render("tasks/new", { checklistId: req.params.id, task: task });
  } catch (error) {
    res
      .status(422)
      .render("pages/erro", { errors: "Erro ao carregar o formulário" });
  }
});

checklistDependentRoute.post("/:id/tasks", async (req, res) => {
  let { name } = req.body.task;
  let task = new Task({ name, checklist: req.params.id });
  try {
    await task.save();
    let checklist = await Checklist.findById(req.params.id);
    checklist.tasks.push(task);
    await checklist.save();
    res.redirect(`/checklists/${req.params.id}`);
  } catch (error) {
    let errors = error.errors;
    res.status(422).render("tasks/new", {
      task: { ...task, errors },
      checklistId: require.params.id,
    });
  }
});

simpleRouter.put("/:id", async (req, res) => {
  let task = Task.findById(req.params.id);
  try {
    task.set(req.body.task);
    await task.save();
    res.stauts(200).json({ task });
  } catch (error) {
    let errors = error.errors;
    res.status(422).json({ task: { ...errors } });
  }
});

module.exports = {
  checklistDependent: checklistDependentRoute,
  simple: simpleRouter,
};
