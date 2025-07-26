import React, { useState } from 'react';
import { Download, FileText, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

const TestAppGenerator = () => {
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [status, setStatus] = useState('');

  const createTestFiles = () => {
    const files = [
      {
        name: 'MainActivity.kt',
        content: `package com.example.testapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        val titleText = findViewById<TextView>(R.id.titleText)
        val counterText = findViewById<TextView>(R.id.counterText)
        val incrementButton = findViewById<Button>(R.id.incrementButton)
        val resetButton = findViewById<Button>(R.id.resetButton)
        val testButton = findViewById<Button>(R.id.testButton)
        
        var counter = 0
        
        titleText.text = "🤖 Test App Generata"
        counterText.text = "Counter: $counter"
        
        incrementButton.setOnClickListener {
            counter++
            counterText.text = "Counter: $counter"
            if (counter == 10) {
                Toast.makeText(this, "🎉 Hai raggiunto 10!", Toast.LENGTH_SHORT).show()
            }
        }
        
        resetButton.setOnClickListener {
            counter = 0
            counterText.text = "Counter: $counter"
            Toast.makeText(this, "🔄 Counter resettato", Toast.LENGTH_SHORT).show()
        }
        
        testButton.setOnClickListener {
            val utils = AppUtils()
            val message = utils.getTestMessage()
            Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        }
    }
}`
      },
      {
        name: 'AppUtils.kt',
        content: `package com.example.testapp

import android.content.Context
import java.text.SimpleDateFormat
import java.util.*

class AppUtils {
    
    fun getTestMessage(): String {
        val currentTime = getCurrentTime()
        return "✅ Generatore funziona! Ora: $currentTime"
    }
    
    fun getCurrentTime(): String {
        val formatter = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
        return formatter.format(Date())
    }
    
    fun formatCounter(count: Int): String {
        return when {
            count == 0 -> "🏁 Inizia a contare"
            count < 5 -> "📈 $count - Continua così!"
            count < 10 -> "🔥 $count - Quasi al traguardo!"
            count == 10 -> "🎯 $count - Perfetto!"
            else -> "🚀 $count - Oltre il limite!"
        }
    }
    
    fun isEven(number: Int): Boolean = number % 2 == 0
    
    companion object {
        const val APP_NAME = "Test App Generator"
        const val VERSION = "1.0.0"
        
        fun getAppInfo(): String {
            return "$APP_NAME v$VERSION"
        }
    }
}`
      },
      {
        name: 'User.kt',
        content: `package com.example.testapp

data class User(
    val id: Long,
    val name: String,
    val email: String,
    val isActive: Boolean = true
) {
    
    fun getDisplayName(): String {
        return if (name.isNotBlank()) name else "Utente Anonimo"
    }
    
    fun getFormattedEmail(): String {
        return email.lowercase().trim()
    }
    
    override fun toString(): String {
        val status = if (isActive) "Attivo" else "Inattivo"
        return "User(id=$id, name='$name', email='$email', status=$status)"
    }
}

// Esempio di usage della data class
object UserManager {
    private val users = mutableListOf<User>()
    
    fun addUser(user: User) {
        users.add(user)
    }
    
    fun getUsers(): List<User> = users.toList()
    
    fun getActiveUsers(): List<User> = users.filter { it.isActive }
    
    fun getUserById(id: Long): User? = users.find { it.id == id }
    
    fun createTestUsers(): List<User> {
        return listOf(
            User(1, "Mario Rossi", "mario@example.com"),
            User(2, "Giulia Bianchi", "giulia@example.com"),
            User(3, "Luca Verdi", "luca@example.com", false)
        )
    }
}`
      },
      {
        name: 'Constants.kt',
        content: `package com.example.testapp

object Constants {
    
    // App Configuration
    const val APP_NAME = "Test Generator App"
    const val APP_VERSION = "1.0.0"
    const val DEBUG_MODE = true
    
    // API Configuration
    const val BASE_URL = "https://api.example.com/"
    const val API_TIMEOUT = 30000L
    const val MAX_RETRIES = 3
    
    // UI Configuration
    const val ANIMATION_DURATION = 300L
    const val SPLASH_DELAY = 2000L
    
    // Database
    const val DATABASE_NAME = "test_app_db"
    const val DATABASE_VERSION = 1
    
    // SharedPreferences
    const val PREFS_NAME = "test_app_prefs"
    const val KEY_FIRST_LAUNCH = "first_launch"
    const val KEY_USER_ID = "user_id"
    const val KEY_COUNTER_VALUE = "counter_value"
    
    // Intent Keys
    const val EXTRA_USER_ID = "extra_user_id"
    const val EXTRA_MESSAGE = "extra_message"
    
    // Request Codes
    const val REQUEST_CODE_PERMISSION = 1001
    const val REQUEST_CODE_SETTINGS = 1002
    
    // Test Data
    val TEST_MESSAGES = listOf(
        "🎉 App generata con successo!",
        "🚀 Il generatore funziona perfettamente!",
        "✅ Tutti i file sono stati creati correttamente!",
        "🛠️ Test superato - pronto per lo sviluppo!",
        "📱 La tua app Android è pronta!"
    )
    
    fun getRandomTestMessage(): String {
        return TEST_MESSAGES.random()
    }
}`
      }
    ];

    setGeneratedFiles(files);
    setStatus('success');
  };

  const createConfigJSON = () => {
    const config = {
      "fileRenames": {
        "MainActivity.kt": "MainActivity.kt",
        "AppUtils.kt": "AppUtils.kt"
      },
      "folderMappings": {
        "AppUtils.kt": "utils",
        "User.kt": "data/model",
        "Constants.kt": "core"
      },
      "copyToMultipleLocations": {
        "Constants.kt": [
          "core/Constants.kt",
          "utils/AppConstants.kt"
        ]
      }
    };

    return JSON.stringify(config, null, 2);
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    generatedFiles.forEach(file => {
      downloadFile(file.name, file.content);
    });
    downloadFile('config.json', createConfigJSON());
  };

  const expectedLayout = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:gravity="center">

    <TextView
        android:id="@+id/titleText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Test App"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="32dp"
        android:textColor="@android:color/black" />

    <TextView
        android:id="@+id/counterText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Counter: 0"
        android:textSize="18sp"
        android:layout_marginBottom="24dp"
        android:textColor="@android:color/black" />

    <Button
        android:id="@+id/incrementButton"
        android:layout_width="200dp"
        android:layout_height="wrap_content"
        android:text="➕ Incrementa"
        android:layout_marginBottom="16dp" />

    <Button
        android:id="@+id/resetButton"
        android:layout_width="200dp"
        android:layout_height="wrap_content"
        android:text="🔄 Reset"
        android:layout_marginBottom="16dp" />

    <Button
        android:id="@+id/testButton"
        android:layout_width="200dp"
        android:layout_height="wrap_content"
        android:text="🧪 Test Utils"
        android:layout_marginBottom="16dp" />

</LinearLayout>`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🤖 Test App per Android Generator
          </h1>
          <p className="text-gray-600">
            Genera file di test per verificare che il generatore Android funzioni correttamente
          </p>
        </div>

        {/* Sezione di generazione */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Genera File di Test
          </h2>
          
          <button
            onClick={createTestFiles}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Crea File di Test
          </button>

          {status === 'success' && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                File di test generati con successo!
              </p>
            </div>
          )}
        </div>

        {/* Lista file generati */}
        {generatedFiles.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">File Generati:</h3>
            <div className="grid gap-3">
              {generatedFiles.map((file, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">{file.name}</span>
                    <p className="text-sm text-gray-600">
                      {file.content.split('\n').length} righe
                    </p>
                  </div>
                  <button
                    onClick={() => downloadFile(file.name, file.content)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Scarica
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-3">
              <button
                onClick={downloadAllFiles}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Scarica Tutti + Config JSON
              </button>
            </div>
          </div>
        )}

        {/* Istruzioni */}
        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Come Testare
          </h3>
          
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Scarica tutti i file di test usando il pulsante sopra</li>
            <li>Carica i file .kt nel tuo Android Project Generator</li>
            <li>Carica anche il file config.json per testare le trasformazioni</li>
            <li>Configura il progetto con questi valori:
              <div className="bg-white p-3 rounded mt-2 text-sm font-mono">
                <div>Nome App: Test Generator App</div>
                <div>Package: com.example.testapp</div>
                <div>Min SDK: API 24</div>
              </div>
            </li>
            <li>Genera il progetto Android</li>
            <li>Apri in Android Studio e sostituisci activity_main.xml con il layout sottostante</li>
            <li>Compila ed esegui l'app</li>
          </ol>
        </div>

        {/* Layout XML necessario */}
        <div className="bg-purple-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Layout XML da Sostituire</h3>
          <p className="text-gray-600 mb-3">
            Sostituisci il contenuto di <code className="bg-purple-200 px-2 py-1 rounded">activity_main.xml</code> con:
          </p>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">{expectedLayout}</pre>
          </div>
          
          <button
            onClick={() => downloadFile('activity_main.xml', expectedLayout)}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Scarica Layout XML
          </button>
        </div>

        {/* Cosa dovrebbe fare l'app */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Funzionalità Expected
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">L'app dovrebbe:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>Mostrare un titolo "🤖 Test App Generata"</li>
                <li>Avere un counter che inizia da 0</li>
                <li>Bottone "➕ Incrementa" che aumenta il counter</li>
                <li>Bottone "🔄 Reset" che resetta a 0</li>
                <li>Bottone "🧪 Test Utils" che mostra un toast con ora</li>
                <li>Toast speciale quando il counter raggiunge 10</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">File organizzati in:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><code>MainActivity.kt</code> - nella root</li>
                <li><code>utils/AppUtils.kt</code> - nella cartella utils</li>
                <li><code>data/model/User.kt</code> - nella cartella data/model</li>
                <li><code>core/Constants.kt</code> - nella cartella core</li>
                <li><code>utils/AppConstants.kt</code> - copia di Constants</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning sulla struttura */}
        <div className="bg-red-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Possibili Problemi da Verificare
          </h3>
          
          <ul className="list-disc list-inside space-y-2 text-red-700 text-sm">
            <li>Se l'app non compila, verifica che il package name sia corretto in tutti i file</li>
            <li>Se i file non sono nelle cartelle giuste, controlla la logica di <code>folderMappings</code></li>
            <li>Se le copie multiple non funzionano, verifica <code>copyToMultipleLocations</code></li>
            <li>Se manca activity_main.xml, il generatore potrebbe non sostituire il layout di default</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestAppGenerator;
