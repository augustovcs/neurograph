using Microsoft.AspNetCore.Mvc;
using NeuroGraph.Main.Dtos;
using NeuroGraph.Main.Entities;
using NeuroGraph.Main.Data;
using Microsoft.EntityFrameworkCore;

namespace NeuroGraph.Main.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NeuronsController : ControllerBase
{
    private readonly AppDbContext _db;

    public NeuronsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NeuronDto>>> Get()
    {
        var data = await _db.Neurons
            .Select(n => new NeuronDto(n.Id, n.Label, n.X, n.Y, n.Status, n.Energy))
            .ToListAsync();
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NeuronDto>> GetById(Guid id)
    {
        var neuron = await _db.Neurons.FindAsync(id);
        if (neuron == null) return NotFound();

        var dto = new NeuronDto(neuron.Id, neuron.Label, neuron.X, neuron.Y, neuron.Status, neuron.Energy);
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<NeuronDto>> Post([FromBody] CreateNeuronDto dto)
    {
        var neuron = new Neuron
        {
            Id = Guid.NewGuid(),
            Label = dto.Label,
            X = dto.X,
            Y = dto.Y,
            Status = "idle",
            Energy = 1.0
        };

        _db.Neurons.Add(neuron);
        await _db.SaveChangesAsync();

        var result = new NeuronDto(neuron.Id, neuron.Label, neuron.X, neuron.Y, neuron.Status, neuron.Energy);
        return CreatedAtAction(nameof(GetById), new { id = neuron.Id }, result);
    }
}