import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

data = pd.read_csv('cod2.csv')
variable_of_interest = 'Age-adjusted Death Rate'

sns.boxplot(x = data[variable_of_interest], showfliers=True, color="pink")
plt.title(f'Boxplot of {variable_of_interest}')
plt.show()

plt.clf()
sns.stripplot(x=data[variable_of_interest], y = data["Year"],color="pink")
plt.title(f"Strip plot of {variable_of_interest}")
plt.show()
