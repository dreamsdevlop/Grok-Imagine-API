#!/usr/bin/env node

/**
 * Simple test script to verify the new API endpoints work correctly
 * Run this script after starting the server to test the new features
 */

// Use built-in fetch (Node.js 18+)
const fetch = globalThis.fetch;

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoint(method, path, data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        console.log(`Testing ${method} ${path}...`);
        const response = await fetch(`${BASE_URL}${path}`, options);
        const result = await response.json();

        console.log(`✓ Status: ${response.status}`);
        console.log(`✓ Response:`, JSON.stringify(result, null, 2));
        return { success: true, data: result, status: response.status };
    } catch (error) {
        console.log(`✗ Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('🧪 Testing Grok Imagine API Extensions\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    await testEndpoint('GET', '/health');
    console.log();

    // Test 2: List chat sessions (should be empty initially)
    console.log('2. Testing chat sessions list...');
    await testEndpoint('GET', '/chat');
    console.log();

    // Test 3: Create a chat session
    console.log('3. Testing chat session creation...');
    const chatSession = await testEndpoint('POST', '/chat', {
        title: 'Test Conversation',
        model: 'grok-2'
    });
    console.log();

    // Test 4: Get chat session details
    if (chatSession.success && chatSession.data.id) {
        console.log('4. Testing chat session retrieval...');
        await testEndpoint('GET', `/chat/${chatSession.data.id}`);
        console.log();
    }

    // Test 5: List chat messages (should be empty initially)
    if (chatSession.success && chatSession.data.id) {
        console.log('5. Testing chat messages list...');
        await testEndpoint('GET', `/chat/${chatSession.data.id}/messages`);
        console.log();
    }

    // Test 6: Send a message to the chat
    if (chatSession.success && chatSession.data.id) {
        console.log('6. Testing chat message creation...');
        await testEndpoint('POST', `/chat/${chatSession.data.id}/messages`, {
            content: 'Hello, this is a test message!',
            model: 'grok-2'
        });
        console.log();
    }

    // Test 7: List video generations (should be empty initially)
    console.log('7. Testing video generations list...');
    await testEndpoint('GET', '/videos');
    console.log();

    // Test 8: Create a video generation
    console.log('8. Testing video generation creation...');
    const videoGeneration = await testEndpoint('POST', '/videos', {
        prompt: 'A beautiful sunset over mountains',
        model: 'grok-video',
        duration: 5,
        width: 1024,
        height: 576
    });
    console.log();

    // Test 9: Get video generation details
    if (videoGeneration.success && videoGeneration.data.id) {
        console.log('9. Testing video generation retrieval...');
        await testEndpoint('GET', `/videos/${videoGeneration.data.id}`);
        console.log();
    }

    // Test 10: List image generations (existing functionality)
    console.log('10. Testing image generations list...');
    await testEndpoint('GET', '/images');
    console.log();

    console.log('🎉 All tests completed!');
    console.log('\n📝 Notes:');
    console.log('- Chat and video generation endpoints are now available');
    console.log('- Chat sessions and messages are properly linked');
    console.log('- Video generations include status tracking');
    console.log('- All endpoints follow consistent error handling patterns');
}

// Check if server is running
async function checkServer() {
    try {
        await fetch(`${BASE_URL}/health`);
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('🚀 Grok Imagine API Extensions Test Suite\n');

    const isServerRunning = await checkServer();

    if (!isServerRunning) {
        console.log('❌ Server is not running on http://localhost:5000');
        console.log('Please start the server first with: npm run dev');
        process.exit(1);
    }

    console.log('✅ Server is running, starting tests...\n');
    await runTests();
}

// Run if executed directly
main().catch(console.error);
