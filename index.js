<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp Message Sender</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <style>
        :root {
            --primary-color: #25D366;
            --secondary-color: #128C7E;
            --background-color: #111827;
            --text-color: #E5E7EB;
            --card-bg: #1F2937;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: var(--background-color);
            color: var(--text-color);
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }

        .banner {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background-color: var(--card-bg);
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .banner pre {
            font-family: monospace;
            white-space: pre;
            margin: 1rem 0;
            color: var(--primary-color);
        }

        .info {
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #9CA3AF;
        }

        .form-section {
            background-color: var(--card-bg);
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--primary-color);
        }

        input[type="text"],
        input[type="number"],
        input[type="file"],
        select,
        textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #374151;
            border-radius: 4px;
            background-color: #374151;
            color: var(--text-color);
            margin-bottom: 0.5rem;
        }

        button {
            background-color: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: var(--secondary-color);
        }

        .target-list {
            margin-top: 1rem;
        }

        .target-item {
            background-color: #374151;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .remove-btn {
            background-color: #EF4444;
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
        }

        .status {
            margin-top: 1rem;
            padding: 1rem;
            background-color: #374151;
            border-radius: 4px;
        }

        #messageLog {
            height: 200px;
            overflow-y: auto;
            background-color: #374151;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
        }

        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="banner">
            <pre>
 __    __ _           _                         
/ /\ /\ \ |__   __ _| |_ ___  __ _ _ __  _ __  
\ \/  \/ / '_ \ / _` | __/ __|/ _` | '_ \| '_ \ 
 \  /\  /| | | | (_| | |\__ \ (_| | |_) | |_) |
  \/  \/ |_| |_|\__,_|\__|___/\__,_| .__/| .__/ 
                                   |_|   |_|    
            </pre>
            <div class="info">
                <p>[~] Author  : DEVILXD</p>
                <p>[~] GitHub  : DeViiLXD</p>
                <p>[~] Tool    : Automatic WhatsApp Message Sender</p>
            </div>
        </div>

        <div id="authSection" class="form-section" style="display: block;">
            <div class="form-group">
                <label>Your System Key:</label>
                <input type="text" id="systemKey" readonly>
            </div>
            <button id="checkApproval">Check Approval</button>
        </div>

        <div id="loginSection" class="form-section">
            <div class="form-group">
                <label>Enter Your Phone Number:</label>
                <input type="text" id="phoneNumber" placeholder="+1234567890">
            </div>
            <button id="requestCode">Request Pairing Code</button>
            <div id="pairingCode" class="status hidden"></div>
        </div>

        <div id="messageSection" class="form-section">
            <div class="form-group">
                <label>Select Message Type:</label>
                <select id="messageType">
                    <option value="number">Send to Target Number</option>
                    <option value="group">Send to WhatsApp Group</option>
                </select>
            </div>

            <div id="targetInputSection" class="form-group">
                <label>Add Target Number:</label>
                <input type="text" id="targetInput" placeholder="Enter number">
                <button id="addTarget">Add Target</button>
                <div id="targetList" class="target-list"></div>
            </div>

            <div class="form-group">
                <label>Messages File:</label>
                <input type="file" id="messageFile" accept=".txt">
            </div>

            <div class="form-group">
                <label>Hater Name (Message Prefix):</label>
                <input type="text" id="messagePrefix" placeholder="Enter prefix">
            </div>

            <div class="form-group">
                <label>Message Delay (seconds):</label>
                <input type="number" id="messageDelay" min="1" value="5">
            </div>

            <button id="startSending">Start Sending Messages</button>

            <div id="messageLog"></div>
        </div>
    </div>

    <script>
        // Generate system key
        const generateSystemKey = () => {
            const platform = navigator.platform;
            const username = navigator.userAgent;
            return CryptoJS.SHA256(platform + username).toString();
        };

        // Initialize UI
        document.addEventListener('DOMContentLoaded', () => {
            const systemKey = generateSystemKey();
            document.getElementById('systemKey').value = systemKey;

            // Store targets
            let targets = [];

            // UI Elements
            const checkApprovalBtn = document.getElementById('checkApproval');
            const authSection = document.getElementById('authSection');
            const loginSection = document.getElementById('loginSection');
            const messageSection = document.getElementById('messageSection');
            const addTargetBtn = document.getElementById('addTarget');
            const targetList = document.getElementById('targetList');
            const startSendingBtn = document.getElementById('startSending');
            const messageLog = document.getElementById('messageLog');

            // Check Approval
            checkApprovalBtn.addEventListener('click', () => {
                // Simulate approval check (in real implementation, this would check against a server)
                setTimeout(() => {
                    authSection.style.display = 'none';
                    loginSection.style.display = 'block';
                }, 1000);
            });

            // Request Pairing Code
            document.getElementById('requestCode').addEventListener('click', () => {
                const phoneNumber = document.getElementById('phoneNumber').value;
                if (phoneNumber) {
                    const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                    document.getElementById('pairingCode').textContent = `Your pairing code: ${pairingCode}`;
                    document.getElementById('pairingCode').classList.remove('hidden');
                    
                    setTimeout(() => {
                        loginSection.style.display = 'none';
                        messageSection.style.display = 'block';
                    }, 2000);
                }
            });

            // Add Target
            addTargetBtn.addEventListener('click', () => {
                const targetInput = document.getElementById('targetInput');
                const target = targetInput.value.trim();
                
                if (target && !targets.includes(target)) {
                    targets.push(target);
                    const targetItem = document.createElement('div');
                    targetItem.className = 'target-item';
                    targetItem.innerHTML = `
                        <span>${target}</span>
                        <button class="remove-btn" data-target="${target}">Remove</button>
                    `;
                    targetList.appendChild(targetItem);
                    targetInput.value = '';
                }
            });

            // Remove Target
            targetList.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-btn')) {
                    const target = e.target.dataset.target;
                    targets = targets.filter(t => t !== target);
                    e.target.parentElement.remove();
                }
            });

            // Start Sending Messages
            startSendingBtn.addEventListener('click', () => {
                const messageFile = document.getElementById('messageFile').files[0];
                const prefix = document.getElementById('messagePrefix').value;
                const delay = document.getElementById('messageDelay').value;

                if (messageFile && targets.length > 0) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const messages = e.target.result.split('\n').filter(msg => msg.trim());
                        simulateMessageSending(messages, prefix, delay);
                    };
                    reader.readAsText(messageFile);
                }
            });

            // Simulate message sending
            function simulateMessageSending(messages, prefix, delay) {
                let messageIndex = 0;
                
                function sendNext() {
                    if (messageIndex < messages.length) {
                        const message = messages[messageIndex];
                        const currentTime = new Date().toLocaleTimeString();
                        
                        targets.forEach(target => {
                            const logEntry = document.createElement('div');
                            logEntry.textContent = `${currentTime} - Sent to ${target}: ${prefix} ${message}`;
                            messageLog.appendChild(logEntry);
                            messageLog.scrollTop = messageLog.scrollHeight;
                        });

                        messageIndex++;
                        setTimeout(sendNext, delay * 1000);
                    }
                }

                sendNext();
            }
        });
    </script>
</body>
</html>
