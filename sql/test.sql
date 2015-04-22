SELECT o.objetivoId, o.nombre, o.categoriaId, o.tipoId, c.nombre AS ncategoria, t.nombre AS ntipo,
o.evaluadorId, tr.nombre AS nevaluador
FROM objetivos AS o 
LEFT JOIN categorias AS c ON c.categoriaId = o.categoriaId 
LEFT JOIN tipos AS t ON t.tipoId = o.tipoId 
LEFT JOIN trabajadores AS tr ON tr.trabajadorId = o.evaluadorId