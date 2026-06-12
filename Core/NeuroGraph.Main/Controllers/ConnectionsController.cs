using Microsoft.AspNetCore.Mvc;
using NeuroGraph.Main.Dtos;
using NeuroGraph.Main.Data;
using Microsoft.EntityFrameworkCore;
using NeuroGraph.Main.Entities;


namespace NeuroGraph.Main.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConnectionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ConnectionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ConnectionDto>>> Get()
    {
        var data = await _db.NeuralConnections
            .Select(c => new ConnectionDto(c.Id, c.SourceNeuronId, c.TargetNeuronId, c.Weight, c.IsExcitatory))
            .ToListAsync();
        return Ok(data);
    }
}