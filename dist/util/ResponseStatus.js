"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReponseStatues = ReponseStatues;
function ReponseStatues(responseServer, req, res) {
    if (responseServer.status === "success") {
        res.status(200).json(responseServer);
    }
    else if (responseServer.status === "fail") {
        res.status(404).json(responseServer);
    }
    else {
        res.status(500).json(responseServer);
    }
}
