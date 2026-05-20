package com.example.projeto.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.projeto.model.Produto;
import com.example.projeto.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    public Produto salvarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Optional<Produto> atualizarProduto(Long id, Produto produtoAtualizado) {
        return produtoRepository.findById(id)
            .map(produtoExistente -> {
                produtoExistente.setNome(produtoAtualizado.getNome());
                produtoExistente.setQuantidade(produtoAtualizado.getQuantidade());
                produtoExistente.setValor(produtoAtualizado.getValor());
                return produtoRepository.save(produtoExistente);
            });
    }

    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }
}