import random
import time

def isInteger(string):
    try:
        int(string)
        return True
    except ValueError:
        return False

def inputInteger(message):
    invalidInput = True
    while invalidInput:
        result = input(message)
        if isInteger(result):
            result = int(result)
            invalidInput = False
        else:
            print("Please enter a valid integer value")
    return result

def inputIntegerBetween(message, lowBound, highBound):
    invalidInput = True
    while invalidInput:
        result = inputInteger(message)
        if result < lowBound:
            print("Please enter a value larger than or equal to ", lowBound)
        elif result > highBound:
            print("Please enter a value smaller than or equal to ", highBound)
        else:
            invalidInput = False
    return result

def obtainYesNo(message):
    validResponse = False
    message = message.lower()

    while not validResponse:
        result = input(message + "(y/n): ")
        if result == "y" or result == "n":
            validResponse = True
    return result

def menuOption():
    print("\nWhat mode would you like to choose: \n\t1. Amateur \n\t2. Rookie \n\t3. Professional ")

def userList():
    amateurChoice = random.randint(1, 5)
    if userChoice == 1:
        if amateurChoice == 1:
            amateurStatement = "It takes a long time to bring excellence to maturity."
        elif amateurChoice == 2:
            amateurStatement = "We wish to inspire the preference we feel; love must be mutual."
        elif amateurChoice == 3:
            amateurStatement = "Always remember: If you need a helping hand, the best place to look is at the end of your sleeve."
        elif amateurChoice == 4:
            amateurStatement = "If words were invented to conceal thought, newspapers are a great improvement of a bad invention"
        elif amateurChoice == 5:
            amateurStatement = "If you don't know where you're going, you'll end up somewhere else."

        return amateurStatement

    if userChoice == 2:
        rookieChoice = random.randint(6, 10)
        if rookieChoice == 6:
            rookieStatement = "Fame is what you have taken, character is what you give. When to this truth you awaken, then you begin to live."
        if rookieChoice == 7:
            rookieStatement = "I hate it when my foot falls asleep during the day because that means it's going to be up all night."
        if rookieChoice == 8:
            rookieStatement = "One of the lessons of history is that nothing is often a good thing to do and always a clever thing to say."
        if rookieChoice == 9:
            rookieStatement = "There are two ways of exerting one's strength: one is pushing down, the other is pulling up."
        if rookieChoice == 10:
            rookieStatement = "A book is like a piece of rope; it takes on meaning only in connection with the things it holds together."

        return rookieStatement

    if userChoice == 3:
        proChoice = random.randint(11, 15)
        if proChoice == 11:
            proStatement = "True greatness is the most ready to recognize and most willing to obey those simple outward laws which have been sanctioned by the experience of mankind."
        elif proChoice == 12:
            proStatement = "Act only on that maxim whereby thou canst at the same time will that it should become a universal law."
        elif proChoice == 13:
            proStatement = "Leftovers in their less visible form are called memories. Stored in the refrigerator of the mind and the cupboard of the heart."
        elif proChoice == 14:
            proStatement = "We must reserve a back shop all our own entirely free, in which to establish our real liberty and our principal retreat and solitude."
        elif proChoice == 15:
            proStatement = "The temptation to form premature theories upon insufficient data is the bane of our profession."

        return proStatement

def findError():

# Main Program

print("Welcome to the Typing Test Simulator! ")
menuOption()
userChoice = inputIntegerBetween("\nPlease enter your one menu option: ", 1, 3)

validChoice = True
while validChoice:
    if userChoice == 1:
        print("Amateur Mode Activated")
        Amateur = userList()
        print(Amateur)
        start = time.time()
        userAmateur = input("Please type this phrase: ")

        finish = time.time()
        timeTaken = finish - start
        timeTaken = round(timeTaken, 2)
        print("It took you: " + str(timeTaken) + " seconds!")
        if userAmateur == Amateur:
            print("You typed with no Mistakes")
        else:
            print("You typed with mistakes")
        validChoice = True

    elif userChoice == 2:
        print("Rookie Mode Activated")
        Rookie = userList()
        print(Rookie)
        start = time.time()
        userRookie = input("Please type this phrase: ")

        finish = time.time()
        timeTaken = finish - start
        timeTaken = round(timeTaken, 2)
        print("It took you: " + str(timeTaken) + " seconds!")
        if userRookie == Rookie:
            print("You typed with no mistakes")
        else:
            print("You typed with  mistakes")
        validChoice = True

    elif userChoice == 3:
        print("Professional Mode Activated")
        Pro = userList()
        print(Pro)
        start = time.time()
        userPro = input("Please type this phrase: ")

        finish = time.time()
        timeTaken = finish - start
        timeTaken = round(timeTaken, 2)
        print("It took you: " + str(timeTaken) + " seconds!")
        if userPro == Pro:
            print("You typed with no mistakes")
        else:
            print("You typed with  mistakes")
        validChoice = True

    keepGoing = obtainYesNo("\nWould you like to continue")
    if keepGoing == "y":
        menuOption()
        userChoice = inputIntegerBetween("\nPlease enter your one menu option: ", 1, 3)
    else:
        print("Have a nice day")
        break

