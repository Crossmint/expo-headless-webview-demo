import type { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { userAgent } from "@/app/utils/userAgent";
import { apiUrl } from "@/app/utils/config";
import { defaultCheckoutOptions, generateCheckoutUrl } from "@app/common";

interface AmountViewProps {
  inputAmount: string;
  onSelectAmount: (amount: number) => void;
  onNumberPress: (num: string) => void;
  onDeletePress: () => void;
}

const AmountView: React.FC<AmountViewProps> = ({
  inputAmount,
  onSelectAmount,
  onNumberPress,
  onDeletePress,
}) => {
  const { data: uri, isLoading } = useQuery({
    queryKey: ["checkout", inputAmount],
    queryFn: async () => {
      if (!inputAmount || inputAmount === "0") {
        return null;
      }

      return generateCheckoutUrl(apiUrl, {
        ...defaultCheckoutOptions,
        lineItems: {
          ...defaultCheckoutOptions.lineItems,
          executionParameters: {
            ...defaultCheckoutOptions.lineItems.executionParameters,
            amount: inputAmount,
          },
        },
      });
    },
    enabled: !!inputAmount && inputAmount !== "0",
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>How much do you want to buy?</Text>
      </View>

      <View style={styles.amountInputContainer}>
        <View style={styles.amountCard}>
          <View style={styles.amountContainer}>
            <View style={styles.amountDisplay}>
              <Text style={styles.dollarSign}>$</Text>
              <Text style={styles.amountValue}>{inputAmount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickAmountContainer}>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => onSelectAmount(25)}
          >
            <Text style={styles.quickAmountText}>$25</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => onSelectAmount(50)}
          >
            <Text style={styles.quickAmountText}>$50</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => onSelectAmount(75)}
          >
            <Text style={styles.quickAmountText}>$75</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => onSelectAmount(100)}
          >
            <Text style={styles.quickAmountText}>$100</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("1")}
            >
              <Text style={styles.keypadButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("2")}
            >
              <Text style={styles.keypadButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("3")}
            >
              <Text style={styles.keypadButtonText}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("4")}
            >
              <Text style={styles.keypadButtonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("5")}
            >
              <Text style={styles.keypadButtonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("6")}
            >
              <Text style={styles.keypadButtonText}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("7")}
            >
              <Text style={styles.keypadButtonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("8")}
            >
              <Text style={styles.keypadButtonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("9")}
            >
              <Text style={styles.keypadButtonText}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => onNumberPress("0")}
            >
              <Text style={styles.keypadButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={onDeletePress}
            >
              <Ionicons name="backspace-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.webviewContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00C853" />
            </View>
          ) : uri ? (
            <WebView
              key={uri}
              source={{ uri }}
              style={styles.webview}
              originWhitelist={["*"]}
              scrollEnabled={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              thirdPartyCookiesEnabled={true}
              cacheEnabled={true}
              userAgent={userAgent}
              mixedContentMode="always"
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              geolocationEnabled={true}
              mediaPlaybackRequiresUserGesture={false}
              allowsInlineMediaPlayback={true}
            />
          ) : (
            <View style={styles.disabledButton}>
              <Text style={styles.disabledButtonText}>Enter an amount</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default function CrossmintApp() {
  const [inputAmount, setInputAmount] = useState("1");

  const handleSelectAmount = (amount: number) => {
    setInputAmount(amount.toString());
  };

  const handleNumberPress = (num: string) => {
    let newInputAmount: string;
    if (inputAmount === "0") {
      newInputAmount = num;
    } else {
      newInputAmount = inputAmount + num;
    }
    setInputAmount(newInputAmount);
  };

  const handleDeletePress = () => {
    let newInputAmount = "0";
    if (inputAmount.length > 1) {
      newInputAmount = inputAmount.slice(0, -1);
    }
    setInputAmount(newInputAmount);
  };

  return (
    <AmountView
      inputAmount={inputAmount}
      onSelectAmount={handleSelectAmount}
      onNumberPress={handleNumberPress}
      onDeletePress={handleDeletePress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  amountInputContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  amountCard: {
    borderWidth: 1,
    borderColor: "#00C853",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  amountContainer: {
    width: "100%",
    alignItems: "center",
  },
  amountDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  dollarSign: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#000",
  },
  amountValue: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#000",
    marginRight: 12,
  },
  quickAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  quickAmountButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAmountText: {
    fontSize: 16,
    color: "#333",
  },
  keypadContainer: {
    marginBottom: 24,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  keypadButton: {
    width: 75,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333",
  },
  webviewContainer: {
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  disabledButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  disabledButtonText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "500",
  },
});
