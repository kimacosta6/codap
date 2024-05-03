import { pickRandom } from "mathjs"
import { Random } from "random"
import { FValue } from "../formula-types"

const randomGen = new Random()

export const otherFunctions = {
  // if(expression, value_if_true, value_if_false)
  if: {
    numOfRequiredArguments: 3,
    evaluate: (...args: FValue[]) => args[0] ? args[1] : (args[2] ?? "")
  },

  // randomPick(...args)
  randomPick: {
    numOfRequiredArguments: 1,
    isRandomFunction: true,
    // Nothing to do here, mathjs.pickRandom() has exactly the same signature as CODAP V2 randomPick() function,
    // just the name is different.
    evaluate: (...args: FValue[]) => pickRandom(args)
  },

  // random(min, max)
  random: {
    numOfRequiredArguments: 0,
    isRandomFunction: true,
    // Nothing to do here, Random.float() has exactly the same signature as CODAP V2 random() function.
    evaluate: (...args: FValue[]) => randomGen.float(...args as number[])
  },

  // randomNormal(mean, standard_deviation) Returns a random number drawn from a normal distribution which, by default,
  // has a mean of 0 and a standard deviation of 1.
  randomNormal: {
    numOfRequiredArguments: 0,
    isRandomFunction: true,
    // Nothing to do here, Random.normal() has exactly the same signature as CODAP V2 randomNormal() function.
    evaluate: (...args: FValue[]) => {
      return randomGen.normal(...args as number[])()
    }
  },

  // randomBinomial(n, p) Returns a random integer drawn from a binomial distribution with n independent draws
  // (or experiments) each with probability p of success. Defaults are n = 1, p = 0.5.
  randomBinomial: {
    numOfRequiredArguments: 0,
    isRandomFunction: true,
    // Nothing to do here, Random.binomial() has exactly the same signature as CODAP V2 randomBinomial() function.
    evaluate: (...args: FValue[]) => {
      return randomGen.binomial(...args as number[])()
    }
  },

}
