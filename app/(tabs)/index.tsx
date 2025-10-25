import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const handleSend = () => {
    if (message.trim() === '') return;

    // 🧍‍♂️ Mensaje del usuario
    const userMessage = { id: Date.now().toString(), text: message, sender: 'user' };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simular respuesta del bot después de 1 segundo
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: '🤖 Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?',
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 1000);

    // Scroll al enviar
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }) => <AnimatedMessage text={item.text} sender={item.sender} />;

  const [active, setActive] = useState(null); // botón activo
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Textos distintos para cada botón
  const tooltips = {
    Chats: 'Aquí verás tus conversaciones',
    Contactos: 'Lista de tus contactos',
    Ajustes: 'Diseñado para personalizar tu experiencia de una mejor manera, a tu gusto ',
  };

  const handlePressIn = (button) => {
    setActive(button);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setActive(null));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat con Chat Bot</Text>
        </View>
        <View style={styles.navbar}>
          {Object.keys(tooltips).map((item, index) => (
            <View key={index} style={styles.navItem}>
              <TouchableOpacity
                onPressIn={() => handlePressIn(item)}
                onPressOut={handlePressOut}
              >
                <Text style={styles.navText}>{item}</Text>
              </TouchableOpacity>

              {/* Tooltip animado */}
              {active === item && (
                <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>
                  <Text style={styles.tooltipText}>{tooltips[item]}</Text>
                </Animated.View>
              )}
            </View>
          ))}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>ChatBot Capital One © 2025</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AnimatedMessage({ text, sender }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = sender === 'user';

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.botBubble,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.messageText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    height: 80,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    padding: 5,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    margin: 15,
    backgroundColor: '#333333',
    borderRadius: 20,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 15,
    backgroundColor: '#333333',
    color: '#E0E0E0',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 18,
    width: 55,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#E0E0E0',
    fontSize: 18,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#2A2A2A',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#1E3A5F',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#E0E0E0',
    fontSize: 16,
  },
  footer: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2.5,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#181818',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#BDBDBD',
    fontSize: 15,
  },
  tooltip: {
    position: 'absolute',
    top: 30, // 30px debajo del botón
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
  },
});
