package com.example.app;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ItemController {

    public record ItemIn(@NotBlank String text) {}

    private final ItemRepository repo;

    public ItemController(ItemRepository repo) {
        this.repo = repo;
    }

    @GetMapping({"", "/"})
    public Map<String, String> root() {
        return Map.of("message", "API is running");
    }

    @GetMapping("/items")
    public List<Item> list() {
        return repo.findAll();
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public Item create(@Valid @RequestBody ItemIn in) {
        return repo.save(new Item(in.text()));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }
}
