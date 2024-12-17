package com.example.guiche;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.firestore.FirebaseFirestore;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private EditText etNome, etCpf, etIdade;
    private RadioGroup rgSexo;
    private CheckBox cbGestante;
    private TextView tvFicha, tvNivelUrgencia;

    private FirebaseFirestore db;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db = FirebaseFirestore.getInstance();

        etNome = findViewById(R.id.etNome);
        etCpf = findViewById(R.id.etCpf);
        etIdade = findViewById(R.id.etIdade);
        rgSexo = findViewById(R.id.rgSexo);
        cbGestante = findViewById(R.id.cbGestante);
        Button btnEmitirFicha = findViewById(R.id.btnEmitirFicha);
        tvFicha = findViewById(R.id.tvFicha);
        tvNivelUrgencia = findViewById(R.id.tvNivelUrgencia);
        etCpf.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
        rgSexo.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.rbFeminino) {
                cbGestante.setVisibility(View.VISIBLE);
            } else {
                cbGestante.setVisibility(View.GONE);
                cbGestante.setChecked(false);
            }
        });

        etNome.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int start, int before, int after) {
                String nome = charSequence.toString();
                if (!nome.isEmpty()) {
                    etNome.removeTextChangedListener(this);
                    String formattedName = nome.toUpperCase();
                    etNome.setText(formattedName);
                    etNome.setSelection(formattedName.length());
                    etNome.addTextChangedListener(this);
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {
            }
        });

        etCpf.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int start, int before, int after) {
                String text = charSequence.toString();
                if (text.length() > 11) {
                    text = text.substring(0, 11);
                    etCpf.setText(text);
                    etCpf.setSelection(text.length());
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {
            }
        });

        etIdade.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int start, int before, int after) {
                String idade = charSequence.toString();
                if (idade.length() > 3) {
                    idade = idade.substring(0, 3);
                    etIdade.setText(idade);
                    etIdade.setSelection(idade.length());
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {
            }
        });

        btnEmitirFicha.setOnClickListener(v -> {
            String nome = etNome.getText().toString().trim();
            String cpf = etCpf.getText().toString().trim();
            String idadeStr = etIdade.getText().toString().trim();
            if (nome.isEmpty() || cpf.isEmpty() || idadeStr.isEmpty() || rgSexo.getCheckedRadioButtonId() == -1) {
                Toast.makeText(this, "Por favor, preencha todos os campos.", Toast.LENGTH_SHORT).show();
                return;
            }

            int idade = Integer.parseInt(idadeStr);
            boolean isGestante = cbGestante.isChecked();
            String urgencia = determinarUrgencia(idade, isGestante);

            tvFicha.setText("Ficha Gerada");
            tvFicha.setBackgroundColor(Color.LTGRAY);

            tvNivelUrgencia.setText("Nível de Urgência: " + urgencia);
            tvNivelUrgencia.setBackgroundColor(determinarCorUrgencia(urgencia));

            salvarDados(nome, cpf, idade, urgencia);

            Toast.makeText(this, "Dados salvos e enviados ao médico.", Toast.LENGTH_LONG).show();

            v.postDelayed(this::limparCampos, 5000);
        });
    }

    private String determinarUrgencia(int idade, boolean isGestante) {
        if (isGestante || idade >= 80) {
            return "Emergencial";
        } else if (idade < 1 || idade > 60) {
            return "Urgente";
        } else {
            return "Normal";
        }
    }

    private int determinarCorUrgencia(String urgencia) {
        switch (urgencia) {
            case "Emergencial":
                return Color.RED;
            case "Urgente":
                return Color.YELLOW;
            default:
                return Color.GREEN;
        }
    }

    private void salvarDados(String nome, String cpf, int idade, String urgencia) {
        Map<String, Object> ficha = new HashMap<>();
        ficha.put("nome", nome);
        ficha.put("cpf", cpf);
        ficha.put("idade", idade);
        ficha.put("urgencia", urgencia);

        db.collection("fichas")
                .add(ficha)
                .addOnSuccessListener(documentReference ->
                        Toast.makeText(this, "Ficha salva com sucesso!", Toast.LENGTH_SHORT).show())
                .addOnFailureListener(e ->
                        Toast.makeText(this, "Erro ao salvar ficha: " + e.getMessage(), Toast.LENGTH_SHORT).show());
    }

    private void limparCampos() {
        etNome.setText("");
        etCpf.setText("");
        etIdade.setText("");
        rgSexo.clearCheck();
        cbGestante.setChecked(false);
        cbGestante.setVisibility(View.GONE);

        tvFicha.setText("");
        tvFicha.setBackgroundColor(Color.TRANSPARENT);

        tvNivelUrgencia.setText("");
        tvNivelUrgencia.setBackgroundColor(Color.TRANSPARENT);
    }
}
