
var ObjectId = require('mongoose').Types.ObjectId;
const ActivityCategoryDefinition = require('../models/activityCategoryDefinition');


exports.createDefault = function (req, res, next) {
    //req.body is an array of CategorizedActivities

    let defaultActivities = req.body;
    let userId = "";

    function saveActivity(activities, userId) {
        var activity = activities.pop();
        activity.save((err, savedActivity) => {
            if (err) throw err;

            if (activities.length > 0) {
                saveActivity(activities, userId);
            } else {

                ActivityCategoryDefinition.find({ 'userId': ObjectId(userId) }, (err, activities) => {
                    if (err) {
                        return res.status(500).json({
                            message: "DB Error finding ActivityCategoryDefinition object",
                            data: err
                        });
                    }
                    if (!activities) {
                        return res.status(500).json({ message: "Could not find Activities", data: userId });
                    }
                    return res.status(200).json({ message: "Successfully found Activities", data: activities });
                })
            }
        })
    }

    let newDefaultActivities = [];
    for (let activity of defaultActivities) {
        const newDefaultActivity = new ActivityCategoryDefinition({
            treeId: activity.treeId,
            name: activity.name,
            userId: activity.userId,
            parentTreeId: activity.parentTreeId,
            icon: '',
            color: activity.color,
            description: activity.description

        });
        newDefaultActivities.push(newDefaultActivity);
        userId = activity.userId;
    }

    saveActivity(newDefaultActivities, userId);
}

exports.create = function (req, res, next) {
    const activityCategoryDefinition = new ActivityCategoryDefinition({
        name: req.body.name,
        userId: req.body.userId,
        treeId: req.body.treeId,
        parentTreeId: req.body.parentTreeId,
        icon: '',
        color: req.body.color,
        description: req.body.description

    });
    activityCategoryDefinition.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating ActivityCategoryDefinition object', data: err });
        } else {
            return res.status(200).json({
                message: 'ActivityCategoryDefinition object saved',
                data: activityCategoryDefinition
            });
        }

    });
};
exports.delete = function (req, res, next) {
    ActivityCategoryDefinition.findByIdAndRemove({ '_id': new ObjectId(req.body.id) }, (err, document) => {
        if (err) return res.status(500).json({ message: 'DB error deleting ActivityCategoryDefinition object', status: "ERROR", data: err });
        if (document) {
            return res.status(200).json({ message: "ActivityCategoryDefinition object successfully deleted", status: "SUCCESS", data: req.body.id });
        } else {
            return res.status(200).json({ message: "no document", status: "NO_DOC", data: req.body.id });
        }

    });
};

exports.update = function (req, res, next) {
    let updatedActivityCategoryDefinition = req.body;
    ActivityCategoryDefinition.findByIdAndUpdate({ '_id': new ObjectId(updatedActivityCategoryDefinition.id) }, updatedActivityCategoryDefinition, { new: true }, (err, document) => {
        if (err) return res.status(500).json({ message: 'DB error updating ActivityCategoryDefinition object', data: err });
        else {
            if (!document) {
                return res.status(500).json({ message: "Error updating ActivityCategoryDefinition object", data: req.parms.id });
            } else {
                return res.status(201).json({ message: "Successfully updated", data: document });
            }
        }
    });
};
exports.getByUserId = function (req, res, next) {

    ActivityCategoryDefinition.find({ 'userId': ObjectId(req.params.userId) }, (err, activities) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding ActivityCategoryDefinition object",
                data: err
            });
        }
        if (!activities) {
            return res.status(500).json({ message: "Could not find Activities", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found Activities", data: activities });
    })
};