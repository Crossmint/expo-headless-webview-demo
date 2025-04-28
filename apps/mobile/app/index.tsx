import type { FC } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
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
  onContinue: () => void;
}

const AmountView: React.FC<AmountViewProps> = ({
  inputAmount,
  onSelectAmount,
  onNumberPress,
  onDeletePress,
  onContinue,
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>How much do you want to buy?</Text>
    </View>

    <View style={styles.amountInputContainer}>
      <View style={styles.amountCard}>
        <Text style={styles.youReceiveText}>You receive</Text>
        <View style={styles.amountContainer}>
          <View style={styles.amountDisplay}>
            <Text style={styles.dollarSign}>$</Text>
            <Text style={styles.amountValue}>{inputAmount}</Text>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyText}>TRUMP</Text>
            </View>
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
          <TouchableOpacity style={styles.keypadButton} onPress={onDeletePress}>
            <Ionicons name="backspace-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        disabled={!inputAmount || inputAmount === "0"}
        style={styles.continueButton}
        onPress={onContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface PaymentViewProps {
  uri: string;
}

const PaymentView: FC<PaymentViewProps> = ({ uri }) => (
  <View style={styles.webviewContainer}>
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
  </View>
);

export default function CrossmintApp() {
  const [currentView, setCurrentView] = useState<"amount" | "webview">(
    "amount"
  );
  const [inputAmount, setInputAmount] = useState("1");

  const { data: uri } = useQuery({
    queryKey: ["checkout", inputAmount],
    queryFn: async () => {
      if (!inputAmount) {
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
    enabled: !!inputAmount,
  });

  console.log({ uri });

  const handleSelectAmount = (amount: number) => {
    setInputAmount(amount.toString());
  };

  const handlePayNow = () => {
    setCurrentView("webview");
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

  return currentView === "amount" || !uri ? (
    <AmountView
      inputAmount={inputAmount}
      onSelectAmount={handleSelectAmount}
      onNumberPress={handleNumberPress}
      onDeletePress={handleDeletePress}
      onContinue={handlePayNow}
    />
  ) : (
    <PaymentView uri={uri} />
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
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  balanceContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: "#00C853",
    padding: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00C853",
  },
  secondaryButtonText: {
    color: "#00C853",
    fontSize: 16,
    fontWeight: "500",
  },
  amountsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  amountButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  amountButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#00C853",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "30%",
  },
  amountButtonText: {
    color: "#00C853",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    padding: 16,
  },
  paymentDetails: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  line: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00C853",
  },
  spacer: {
    height: 12,
  },
  webviewContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
    padding: 20,
    width: "100%",
    height: "100%",
  },
  closeButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  closeButton: {
    backgroundColor: "#00C853",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 4,
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
  youReceiveText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
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
  currencyBadge: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  currencyText: {
    fontSize: 14,
    color: "#666",
  },
  conversionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  conversionText: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  conversionAmount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginRight: 5,
  },
  currencyCode: {
    fontSize: 16,
    color: "#666",
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
  continueButton: {
    backgroundColor: "#00C853",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
