
var ObjectId = require('mongoose').Types.ObjectId;
const CategorizedActivity = require('../models/categorizedActivity');


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

                CategorizedActivity.find({ 'userId': ObjectId(userId) }, (err, activities) => {
                    if (err) {
                        return res.status(500).json({
                            message: "DB Error finding CategorizedActivity object",
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
        const newDefaultActivity = new CategorizedActivity({
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
    const categorizedActivity = new CategorizedActivity({
        name: req.body.name,
        userId: req.body.userId,
        treeId: req.body.treeId,
        parentTreeId: req.body.parentTreeId,
        icon: '',
        color: req.body.color,
        description: req.body.description

    });
    categorizedActivity.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error creating CategorizedActivity object', data: err });
        } else {
            return res.status(200).json({
                message: 'CategorizedActivity object saved',
                data: categorizedActivity
            });
        }

    });
};
exports.delete = function (req, res, next) {
    CategorizedActivity.findByIdAndRemove({ '_id': new ObjectId(req.body.id) }, (err, document) => {
        if (err) return res.status(500).json({ message: 'DB error deleting CategorizedActivity object', status: "ERROR", data: err });
        if (document) {
            return res.status(200).json({ message: "CategorizedActivity object successfully deleted", status: "SUCCESS", data: req.body.id });
        } else {
            return res.status(200).json({ message: "no document", status: "NO_DOC", data: req.body.id });
        }

    });
};

exports.update = function (req, res, next) {
    let updatedCategorizedActivity = req.body;
    CategorizedActivity.findByIdAndUpdate({ '_id': new ObjectId(updatedCategorizedActivity.id) }, updatedCategorizedActivity, { new: true }, (err, document) => {
        if (err) return res.status(500).json({ message: 'DB error updating CategorizedActivity object', data: err });
        else {
            if (!document) {
                return res.status(500).json({ message: "Error updating CategorizedActivity object", data: req.parms.id });
            } else {
                return res.status(201).json({ message: "Successfully updated", data: document });
            }
        }
    });
};
exports.getByUserId = function (req, res, next) {

    CategorizedActivity.find({ 'userId': ObjectId(req.params.userId) }, (err, activities) => {
        if (err) {
            return res.status(500).json({
                message: "DB Error finding CategorizedActivity object",
                data: err
            });
        }
        if (!activities) {
            return res.status(500).json({ message: "Could not find Activities", data: req.params.id });
        }
        return res.status(200).json({ message: "Successfully found Activities", data: activities });
    })
};
