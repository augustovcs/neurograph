using NeuroGraph.Main.Entities;
using NeuroGraph.Main.Interfaces;
using Microsoft.AspNetCore.Mvc;
using NeuroGraph.Main.Services;
using NeuroGraph.Main.Data;

namespace Controller.Neurograph.main;


[ApiController]
[Route("[controller]")]
public class SimulationController : ControllerBase
{
   
    private readonly INeuronBehaviorService _behaviorService;
    private readonly INeuronGenerationService _generationService;
    private readonly INeuronResetService _resetService;
    private readonly AppDbContext _db;
    

    public SimulationController(
                    INeuronBehaviorService behaviorService,
                    INeuronGenerationService generationService, 
                    INeuronResetService resetService,
                    AppDbContext db)
    {
        _behaviorService = behaviorService;
        _generationService = generationService;
        _resetService = resetService;
        _db = db;
    }

    [HttpPost("tick")]
    public async Task<IActionResult> RunTick()
    {
        await _behaviorService.RunTickAsync();
        return Ok(new { message = "Tick processado com sucesso" });
    }

    [HttpPost("seed")]
    public async Task<IActionResult> SeedNeurons([FromQuery] int countNeurons)
    {

        await _generationService.LowNeuronSpawn(countNeurons);
        return Ok(new {message = $"Generated {countNeurons} Neurons with Success! "});
       
    }

    [HttpDelete("delete-all-neurons")]
    public async Task<IActionResult> DeleteAllNeurons()
    {
        await _resetService.ResetAllAsync();
        return Ok(new { message = "Deleted all neurons!"}); 
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNeuron(Guid id)
    {
        var neuron = await _db.Neurons.FindAsync(id);
        if (neuron == null) return NotFound(new { message = "Neuron not found" });

        await _resetService.ResetNeuronAsync(id);
        return Ok(new { message = $"Deleted Neuron with id: {id}" });
    }

}
