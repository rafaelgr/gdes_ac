SELECT
e.evaluacionId, e.dFecha, e.hFecha, e.observaciones,
asgp.asgProyectoId, asgp.nombre AS nasgProyecto,
t.trabajadorId, t.nombre AS ntrabajador,
p.proyectoId, p.nombre AS nproyecto,
r.rolId, r.nombre AS nrol,
c.conocimientoId, c.nombre AS nconocimiento,
cc.catConocimientoId, cc.nombre AS ncatConocimiento
FROM evaluaciones AS e
LEFT JOIN asg_proyectos AS asgp ON asgp.asgProyectoId = e.asgProyectoId
LEFT JOIN proyectos AS p ON p.proyectoId = asgp.proyectoId
LEFT JOIN conocimientos AS c ON c.conocimientoId = e.conocimientoId
LEFT JOIN trabajadores AS t ON t.trabajadorId = asgp.trabajadorId
LEFT JOIN catconocimientos AS cc ON cc.catConocimientoId = c.catConocimientoId
LEFT JOIN roles AS r ON r.rolId = asgp.rolId