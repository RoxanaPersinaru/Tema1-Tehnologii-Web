const {resolve, join} = require('path');
const express = require('express');
//const service = require('./service')('items.json');

const PORT = process.env.PORT || 8080;
const service = {
    changeItem: (id, data) => {
       
        console.log(`Updating item with ID ${id} to:`, data);
      
        return { success: true, message: "Item updated successfully" };
    }
};
express()
    .use(express.static(join(resolve(), 'web')))
    .use(express.text())
    .get('/items', (request, response) => {
        const items = service.getItems();
        if (items.length > 0) {
            response.json(items);
        } else {
            response.sendStatus(204);
        }
    })
    .put('/items/:id', (req, res) => {
        const id = req.params.id;
        const data = req.body;
    
        
        const result = service.changeItem(id, data);
    
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ success: false, message: "Failed to update item" });
        }
    })
    .post('/items', (request, response) => {
        const item = service.addItem(request.body);
        response.status(201).send(item.id + '');
    })
    .delete('/items/:id', (request, response) => {
        if (service.removeItem(parseInt(request.params.id))) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));