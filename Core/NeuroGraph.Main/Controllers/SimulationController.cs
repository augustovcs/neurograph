using Api.Entities;
using Interfaces;
using Microsoft.AspNetCore.Mvc;
using Neurograph.Services;

namespace Controller.Neurograph.main;


[ApiController]
[Route("[controller]")]
public class SimulationController : ControllerBase
{
   
    private readonly INeuronBehaviorService _behaviorService;
    private readonly INeuronGenerationService _generationService;

    public SimulationController(INeuronBehaviorService behaviorService, INeuronGenerationService generationService) 
    {
        _behaviorService = behaviorService;
        _generationService = generationService;
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



}
